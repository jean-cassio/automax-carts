import axios from 'axios';

const baseURL = import.meta.env.VITE_API;

const api = axios.create({
  baseURL,
});

export default api;
