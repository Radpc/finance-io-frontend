import axios from "axios";
import { getAccessToken } from "../storage";

export const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH;
export const API = axios.create({ baseURL: API_BASE_PATH });

export const getAuthorizedHeader = (access_token?: string) => {
  const storedToken = getAccessToken();
  return { authorization: `Bearer ${access_token || storedToken}` };
};
