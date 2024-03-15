import axios from "axios";

const Axios = axios.create({
  baseURL: `${import.meta.env.VITE_AXIOS_BASE_URL}`,
});

Axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("userAccessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Axios;