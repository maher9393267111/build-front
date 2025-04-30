import axios from "axios";

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Đổi port và đường dẫn nếu cần
  timeout: 10000, // Thời gian timeout (ms)
});

// Thêm interceptor để tự động thêm token vào headers (nếu cần)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
