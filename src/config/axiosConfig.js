import queryString from 'query-string';
import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://localhost:3002/',
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
  credentials: false,
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});

axiosClient.interceptors.response.use((res) => {
  if (res && res.data) {
    return res.data;
  }
});