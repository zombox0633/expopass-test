import axios from "axios";

export const api = axios.create({
  baseURL: "https://reqres.in/api",
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_REQRES_API_KEY,
  },
});
