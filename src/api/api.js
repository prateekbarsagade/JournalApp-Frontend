import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

// Attach Basic Auth header to every request, if we have credentials
api.interceptors.request.use((config) => {
  const stored = sessionStorage.getItem("authCreds");
  if (stored) {
    const { username, password } = JSON.parse(stored);
    config.headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
  }
  return config;
});

// If a request comes back 401, credentials are bad/expired -> force logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem("authCreds");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ---------- PublicController ----------
export const signup = (username, password) =>
  api.post("/public/createUser", { username, password });

// ---------- JournelEntryController ----------
export const getAllEntries = () => api.get("/journal");
export const getEntryById = (id) => api.get(`/journal/id/${id}`);
export const createEntry = (entry) => api.post("/journal", entry);
export const updateEntry = (id, entry) => api.put(`/journal/id/${id}`, entry);
export const deleteEntry = (id) => api.delete(`/journal/id/${id}`);

// ---------- UserController ----------
export const getAllUsers = () => api.get("/user");
export const getCurrentUser = () => api.get("/user/me");
export const updateSelf = (updates) => api.put("/user", updates);


// ---------- AdminController ----------
export const getAllUsersAdmin = () => api.get("/admin/all-user");
export const createAdmin = (username, password) =>
  api.post("/admin/create-admin", { username, password });

export default api;