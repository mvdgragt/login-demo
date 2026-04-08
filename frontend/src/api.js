const BASE = "http://localhost:3000/api";

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
};

export const login = (email, code) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });

export const logout = () => request("/auth/logout", { method: "POST" });

export const getMe = () => request("/auth/me");

export const getEmployees = () => request("/employees");

export const createEmployee = (payload) =>
  request("/employees", { method: "POST", body: JSON.stringify(payload) });

export const updateEmployee = (id, payload) =>
  request(`/employees/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const deleteEmployee = (id) =>
  request(`/employees/${id}`, { method: "DELETE" });
