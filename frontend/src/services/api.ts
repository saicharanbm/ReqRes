import axios from "axios";
// type apiRequestType = {};

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

export const googleAuth = (code: string) => {
  return axiosInstance.post("/google", { code });
};

export const apiRequest = (data: any) => {
  return axiosInstance.post("/send-api-request", { data });
};
