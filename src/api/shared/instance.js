import axios from "axios";

const Axios = axios.create({
  baseURL: `${import.meta.env.VITE_AXIOS_BASE_URL}`,
});

Axios.interceptors.request.use(
  (config) => {
    let accessToken;
    const pathName = window.location.pathname;

    if (pathName.startsWith("/admin/")) {
      accessToken = localStorage.getItem("adminAccessToken");
    } else if (pathName.startsWith("/theatre/")) {
      accessToken = localStorage.getItem("theatreAccessToken");
    } else {
      accessToken = localStorage.getItem("userAccessToken");
    }
    
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