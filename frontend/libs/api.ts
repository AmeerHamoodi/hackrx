import axios from "axios";
import Router from "next/router";

const API = axios.create({
  baseURL: process.env.BASE_URL,
});

API.interceptors.request.use(
  (config) => {
    config.headers = {
      Authorization: `Bearer ${localStorage.getItem(process.env.AUTH_HEADER as string) as string}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    return config;
  },
  (err) => Promise.reject(err)
);

API.interceptors.response.use(
  (config) => {
    if (config.status === 401 || config.statusText.includes("CORS")) {
      localStorage.clear();
      Router.push("/login");
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default API;
