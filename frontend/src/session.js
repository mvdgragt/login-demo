const KEY = "sg_user";

export const saveSession = (user) =>
  localStorage.setItem(KEY, JSON.stringify(user));
export const clearSession = () => localStorage.removeItem(KEY);

export const loadSession = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
