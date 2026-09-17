const ADMIN_SESSION_KEY = 'eduroute.adminSession';
/** SHA-256 of password "timepass" */
const ADMIN_PASSWORD_HASH = '26fa1ef0060cbe67be260ed64701b8d5dec4c7493c8c59eee455b891cbf4cdd1';

const isBrowser = typeof window !== 'undefined';

const hashPassword = async (password: string): Promise<string> => {
  const encoded = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const validateAdminPassword = async (password: string): Promise<boolean> => {
  if (!isBrowser) {
    return false;
  }

  const normalizedPassword = password.trim();
  if (!normalizedPassword) {
    return false;
  }

  const hashedPassword = await hashPassword(normalizedPassword);
  return hashedPassword === ADMIN_PASSWORD_HASH;
};

export const setAdminSession = (isActive: boolean) => {
  if (!isBrowser) {
    return;
  }

  localStorage.setItem(ADMIN_SESSION_KEY, isActive ? 'active' : 'inactive');
};

export const isAdminSessionActive = (): boolean => {
  if (!isBrowser) {
    return false;
  }

  return localStorage.getItem(ADMIN_SESSION_KEY) === 'active';
};

export const clearAdminSession = () => {
  if (!isBrowser) {
    return;
  }

  localStorage.removeItem(ADMIN_SESSION_KEY);
};
