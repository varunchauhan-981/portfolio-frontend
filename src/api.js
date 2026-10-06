import axios from 'axios';

const API = axios.create({
 baseURL: 'https://portfolio-backend-74pl.onrender.com/api',
});

// Admin routes ke liye token automatic bhejne ka setup
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
