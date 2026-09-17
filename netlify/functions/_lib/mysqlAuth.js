/**
 * MySQL auth — same config as backend/main.go openDB + docker-compose.yml
 *
 * Env (any one style works):
 *   MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 *   or MYSQL_URL / DATABASE_URL  (mysql://user:pass@host:3306/eduroute)
 *
 * docker-compose defaults:
 *   host=mysql|127.0.0.1  user=root  password=eduroute_dev_password  database=eduroute
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let pool = null;

function parseMysqlUrl(raw) {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (!u.protocol.startsWith('mysql')) return null;
    return {
      host: u.hostname,
      port: Number(u.port || 3306),
      user: decodeURIComponent(u.username || 'root'),
      password: decodeURIComponent(u.password || ''),
      database: (u.pathname || '').replace(/^\//, '') || 'eduroute',
    };
  } catch {
    return null;
  }
}

function resolveConfig() {
  const fromUrl = parseMysqlUrl(process.env.MYSQL_URL || process.env.DATABASE_URL);
  if (fromUrl) return fromUrl;

  if (!process.env.MYSQL_HOST && !process.env.MYSQL_USER) return null;

  return {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD != null ? process.env.MYSQL_PASSWORD : '',
    database: process.env.MYSQL_DATABASE || 'eduroute',
  };
}

function hasMysqlEnv() {
  return Boolean(resolveConfig());
}

async function getPool() {
  if (pool) return pool;
  const cfg = resolveConfig();
  if (!cfg) {
    throw new Error('MySQL not configured (set MYSQL_HOST… or MYSQL_URL)');
  }

  pool = mysql.createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    waitForConnections: true,
    connectionLimit: 5,
    // Cloud MySQL often needs SSL
    ssl:
      process.env.MYSQL_SSL === 'true' || process.env.MYSQL_SSL === '1'
        ? { rejectUnauthorized: false }
        : undefined,
  });
  return pool;
}

/** Same users table as backend/db.go ensureSchema */
async function ensureUsersTable(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('student','admin') NOT NULL DEFAULT 'student',
      is_verified BOOLEAN NOT NULL DEFAULT FALSE,
      college_verified ENUM('none','pending','verified','rejected') NOT NULL DEFAULT 'none',
      points INT NOT NULL DEFAULT 0,
      language_preference ENUM('en','hi','hinglish') NOT NULL DEFAULT 'en',
      avatar VARCHAR(500) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

function issueToken(user) {
  const secret = process.env.JWT_SECRET || 'supersecret';
  return jwt.sign(
    {
      id: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus || 'pending',
    },
    secret,
    { expiresIn: '24h' },
  );
}

function toUser(row) {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    role: row.role,
    verificationStatus: row.college_verified || 'pending',
  };
}

async function register({ name, email, password }) {
  if (!name?.trim() || !email?.trim() || !password) {
    return { status: 400, body: { success: false, error: 'Name, email, and password are required' } };
  }
  if (password.length < 8) {
    return { status: 400, body: { success: false, error: 'Password must be at least 8 characters' } };
  }

  const db = await getPool();
  await ensureUsersTable(db);

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  const [existing] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
  if (existing.length > 0) {
    return { status: 409, body: { success: false, error: 'Email already registered' } };
  }

  // bcrypt cost 12 — same as Go backend
  const hash = await bcrypt.hash(password, 12);
  const [result] = await db.query(
    `INSERT INTO users (name, email, password, role, college_verified)
     VALUES (?, ?, ?, 'student', 'pending')`,
    [cleanName, cleanEmail, hash],
  );

  const user = {
    id: String(result.insertId),
    name: cleanName,
    email: cleanEmail,
    role: 'student',
    verificationStatus: 'pending',
  };

  return { status: 201, body: { success: true, token: issueToken(user), user } };
}

async function login({ email, password, role }) {
  if (!email?.trim() || !password) {
    return { status: 400, body: { success: false, error: 'Email and password are required' } };
  }

  const db = await getPool();
  await ensureUsersTable(db);

  const cleanEmail = email.trim().toLowerCase();
  const [rows] = await db.query(
    'SELECT id, name, email, password, role, college_verified FROM users WHERE email = ? LIMIT 1',
    [cleanEmail],
  );

  if (!rows.length) {
    return { status: 401, body: { success: false, error: 'Invalid credentials' } };
  }

  const row = rows[0];
  if (role && row.role !== role) {
    return { status: 403, body: { success: false, error: `Unauthorized for ${role} login` } };
  }

  const ok = await bcrypt.compare(password, row.password);
  if (!ok) {
    return { status: 401, body: { success: false, error: 'Invalid credentials' } };
  }

  const user = toUser(row);
  return { status: 200, body: { success: true, token: issueToken(user), user } };
}

/** Same seeds as backend/db.go ensureDefaultAdmin */
async function ensureAdminSeed() {
  const db = await getPool();
  await ensureUsersTable(db);

  const admins = [
    { email: 'admin@gmail.com', name: 'EduRoute Admin', password: 'timepass' },
    { email: 'vansh777@gmail.com', name: 'EDUROUTE Staff Admin', password: 'timepass' },
  ];

  for (const a of admins) {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [a.email]);
    if (rows.length) continue;
    const hash = await bcrypt.hash(a.password, 12);
    await db.query(
      `INSERT INTO users (name, email, password, role, is_verified, college_verified)
       VALUES (?, ?, ?, 'admin', TRUE, 'verified')`,
      [a.name, a.email, hash],
    );
  }
}

module.exports = {
  hasMysqlEnv,
  register,
  login,
  ensureAdminSeed,
  resolveConfig,
};
