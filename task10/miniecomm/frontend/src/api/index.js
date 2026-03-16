import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    const url = err.config?.url || "";
    if (err.response?.status === 401 && !url.includes("/api/auth/")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (data) => api.post("/api/auth/register", data),
  login:    (data) => api.post("/api/auth/login", data),
};
export const productApi = {
  getAll:  (params) => api.get("/api/products", { params }),
  getOne:  (id)     => api.get(`/api/products/${id}`),
  create:  (data)   => api.post("/api/products", data),
  update:  (id, d)  => api.put(`/api/products/${id}`, d),
  remove:  (id)     => api.delete(`/api/products/${id}`),
};
export const orderApi = {
  create:       (data)        => api.post("/api/orders", data),
  getAll:       ()            => api.get("/api/orders"),
  getOne:       (id)          => api.get(`/api/orders/${id}`),
  updateStatus: (id, status)  => api.put(`/api/orders/${id}/status`, { status }),
};
export default api;
