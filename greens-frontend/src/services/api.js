import axios from "axios";

const isProduction =
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1" &&
  !window.location.hostname.includes("localhost");

console.log("Environment check:", {
  hostname: window.location.hostname,
  isProduction,
  protocol: window.location.protocol,
});

const api = axios.create({
  baseURL: isProduction
    ? "https://greens.org.pl/backend.greens.org.pl/public/api"
    : "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout: isProduction ? 30000 : 10000,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    if (csrfToken) {
      config.headers["X-CSRF-TOKEN"] = csrfToken;
    }

    if (!isProduction) {
      console.log("API Request:", {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    if (!isProduction) {
      console.error("Request Error:", error);
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (!isProduction) {
      console.log("API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    console.error("Response Error:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
      code: error.code,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    if (error.code === "ERR_NETWORK") {
      console.error(
        "Network Error - sprawdź konfigurację CORS i czy serwer działa"
      );
      console.error("Próbowane URL:", error.config?.url);
    }

    return Promise.reject(error);
  }
);

export const testConnection = async () => {
  try {
    console.log("Testing connection to:", api.defaults.baseURL);
    const response = await api.get("/categories");
    console.log("Connection test successful:", response.status);
    return true;
  } catch (error) {
    console.error("Connection test failed:", error.message);
    return false;
  }
};

export default api;
