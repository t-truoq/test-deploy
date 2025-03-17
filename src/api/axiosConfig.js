import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api",

  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Có thể thêm xử lý trước khi gửi request
    // Ví dụ: thêm token authentication
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Xử lý response data trước khi trả về
    return response.data;
  },
  (error) => {
    // Xử lý lỗi
    if (error.response) {
      // Lỗi response từ server (status code không phải 2xx)
      console.error("Response error:", error.response.data);
    } else if (error.request) {
      // Không nhận được response
      console.error("Request error:", error.request);
    } else {
      // Lỗi khi setup request
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Thêm API endpoints cho users
export const usersAPI = {
  getAll: () => axiosInstance.get("/users"),
  getById: (id) => axiosInstance.get(`/users/${id}`),
  create: (data) => axiosInstance.post("/users", data),
  update: (id, data) => axiosInstance.put(`/users/${id}`, data),
  delete: (id) => axiosInstance.delete(`/users/${id}`),
};

// Giữ nguyên servicesAPI
export const servicesAPI = {
  getAll: () => axiosInstance.get("/services"),
  getById: (id) => axiosInstance.get(`/services/${id}`),
  create: (data) => axiosInstance.post("/services", data),
  update: (id, data) => axiosInstance.put(`/services/${id}`, data),
  delete: (id) => axiosInstance.delete(`/services/${id}`),
};

export default axiosInstance;
