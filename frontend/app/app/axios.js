import axios from "axios";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";

const baseURL = "http://http://13.211.204.121/api/";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: Cookies.get("access_token")
      ? "JWT " + Cookies.get("access_token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (typeof error.response === "undefined") {
      alert(
        "A server/network error occurred. " +
          "Looks like CORS might be the problem. " +
          "Sorry about this - we will get it fixed shortly."
      );
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + "token/refresh/"
    ) {
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = Cookies.get("refresh_token");

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          return axiosInstance
            .post("/token/refresh/", { refresh: refreshToken })
            .then((response) => {
              Cookies.set("access_token", response.data.access, { expires: 7 });
              Cookies.set("refresh_token", response.data.refresh, {
                expires: 7,
              });

              axiosInstance.defaults.headers["Authorization"] =
                "JWT " + response.data.access;
              originalRequest.headers["Authorization"] =
                "JWT " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("Refresh token is expired", tokenParts.exp, now);
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");

          signOut({ callbackUrl: "http://localhost:3000/login" });
          // window.location.href = "/api/auth/signin";
        }
      } else {
        console.log("Refresh token not available.");
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");

        signOut({ callbackUrl: "http://localhost:3000/login" });
        // window.location.href = "/api/auth/signin";
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export default axiosInstance;
