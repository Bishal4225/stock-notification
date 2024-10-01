import axios from "axios";

export const axiosNse = axios.create({
  baseURL: process.env.NSE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
