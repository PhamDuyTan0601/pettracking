import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "https://pettracking2.onrender.com";

// Tạo instance axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor để tự động thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor xử lý response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (credentials) => api.post("/api/users/login", credentials),
  register: (userData) => api.post("/api/users/register", userData),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export const petsAPI = {
  getMyPets: () => api.get("/api/pets/my-pets"),
  addPet: (petData) => api.post("/api/pets", petData),
  deletePet: (petId) => api.delete(`/api/pets/${petId}`),
  getPetById: (petId) => api.get(`/api/pets/${petId}`),
};

export const petDataAPI = {
  getLatest: (petId) => api.get(`/api/petData/pet/${petId}/latest`),
  getAll: (petId) => api.get(`/api/petData/pet/${petId}`),
};

export const devicesAPI = {
  register: (deviceData) => api.post("/api/devices/register", deviceData),
  getMyDevices: () => api.get("/api/devices/my-devices"),
  getPetByDevice: (deviceId) => api.get(`/api/devices/pet/${deviceId}`),
};

export default api;
