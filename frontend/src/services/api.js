import axios from "axios";
import toast from "react-hot-toast";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
const API_ORIGIN = new URL(API_BASE_URL).origin;

export const resolveApiUrl = (url) => {
  if (!url) {
    return url;
  }

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      return `${API_ORIGIN}${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return url;
    }
  }

  return new URL(url, API_ORIGIN).toString();
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gp_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";

    if (status === 401) {
      localStorage.removeItem("gp_token");
      localStorage.removeItem("gp_user");
      toast.error("Session expired. Please login again.");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    } else if (status === 403) {
      toast.error("You are not authorized for this action.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  getProfile: () => api.get("/users/me"),
  updateProfile: (payload) => api.put("/users/me", payload),
};

export const serviceApi = {
  getAll: (params = {}) => api.get("/services", { params }),
  create: (payload) => api.post("/services", payload),
  update: (id, payload) => api.put(`/services/${id}`, payload),
  remove: (id) => api.delete(`/services/${id}`),
};

export const applicationApi = {
  apply: (payload) => api.post("/applications", payload),
  getMine: (params = {}) => api.get("/applications/me", { params }),
  getAll: (params = {}) => api.get("/applications", { params }),
  updateStatus: (id, payload) => api.patch(`/applications/${id}/status`, payload),
  remove: (id) => api.delete(`/applications/${id}`),
};

export const complaintApi = {
  create: (payload) => api.post("/complaints", payload),
  getMine: (params = {}) => api.get("/complaints/me", { params }),
  getAll: (params = {}) => api.get("/complaints", { params }),
  updateStatus: (id, payload) => api.patch(`/complaints/${id}/status`, payload),
  remove: (id) => api.delete(`/complaints/${id}`),
};

export const noticeApi = {
  getAll: (params = {}) => api.get("/notices", { params }),
  create: (payload) => api.post("/notices", payload),
  update: (id, payload) => api.put(`/notices/${id}`, payload),
  remove: (id) => api.delete(`/notices/${id}`),
};

export const committeeApi = {
  getAll: (params = {}) => api.get("/committee-members", { params }),
  create: (payload) =>
    api.request({
      method: "post",
      url: "/committee-members",
      data: payload,
      headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
    }),
  update: (id, payload) =>
    api.request({
      method: "put",
      url: `/committee-members/${id}`,
      data: payload,
      headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
    }),
  remove: (id) => api.delete(`/committee-members/${id}`),
};

export const documentApi = {
  upload: (formData) => api.post("/documents", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  getMine: (params = {}) => api.get("/documents/me", { params }),
  getAll: (params = {}) => api.get("/documents", { params }),
  remove: (id) => api.delete(`/documents/${id}`),
};
