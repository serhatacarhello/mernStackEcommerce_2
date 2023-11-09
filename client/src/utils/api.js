// api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const postLogin = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
}

export const postRegister = async (user) => {
  const response = await axios.post(`${API_URL}/register`, user);
  return response.data;  
}