/**
 * Direct MySQL auth for Netlify Functions.
 * Env (Netlify Site settings):
 *   MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 *   MYSQL_PORT (optional, default 3306)
 *   JWT_SECRET (optional)
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let pool = null;

function hasMysqlEnv() {
  return Boolean(
    process.env.MYSQL_HOST &&
      process.env.MYSQL_USER &&
      process.env.MYSQL_DATABASE &&
      process.env.MYSQL_PASSWORD !== undefined,
  );
}

async function getPool() {
  if (pool) return pool;
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
  return pool;
}

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
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

function issueToken(user) {
  const secret = process.env.JWT_SECRET || 'eduroute-netlify-secret';
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

  const hash = await bcrypt.hash(password, 12);
  const [result] = await db.query(
    `INSERT INTO users (name, email, password, role, college_verified) VALUES (?, ?, ?, 'student', 'pending')`,
    [cleanName, cleanEmail, hash],
  );

  const user = {
    id: String(result.insertId),
    name: cleanName,
    email: cleanEmail,
    role: 'student',
    verificationStatus: 'pending',
  };
  const token = issueToken(user);

  return { status: 201, body: { success: true, token, user } };
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
  const token = issueToken(user);
  return { status: 200, body: { success: true, token, user } };
}

/** Seed admin@gmail.com / timepass if missing */
async function ensureAdminSeed() {
  const db = await getPool();
  await ensureUsersTable(db);
  const email = 'admin@gmail.com';
  const [rows] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
  if (rows.length) return;
  const hash = await bcrypt.hash('timepass', 12);
  await db.query(
    `INSERT INTO users (name, email, password, role, is_verified, college_verified)
     VALUES (?, ?, ?, 'admin', TRUE, 'verified')`,
    ['EduRoute Admin', email, hash],
  );
}

module.exports = {
  hasMysqlEnv,
  register,
  login,
  ensureAdminSeed,
};
