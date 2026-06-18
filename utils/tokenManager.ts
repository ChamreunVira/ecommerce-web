"use client";

let _token: string | null =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ2aXJhY2hhbXJldW5AZ21haWwuY29tIiwiaWF0IjoxNzgxNjY4MzYxLCJleHAiOjE3ODE2Njg0MjF9.6_t5VvwKFpItsp4912KvGIEjD522H0_J8wjFg2BkeCmMnVhtFN1BoPwgwdYFpuXYeyCfTC65Fn1s30m3Fwh_mQ";

export const tokenManager = {
  setToken: (token: string) => {
    _token = token;
  },

  getToken: () => {
    return _token;
  },

  removeToken: () => {
    _token = null;
  },
};
