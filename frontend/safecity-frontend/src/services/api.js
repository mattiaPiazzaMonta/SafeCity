// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // il tuo backend!
  headers: {
    'Content-Type': 'application/json'
  }
});

export default API;
