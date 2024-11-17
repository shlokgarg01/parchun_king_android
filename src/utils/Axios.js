import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const BASE_URL = "http://216.107.136.206:4000"
const axiosInstance = axios.create({
  // baseURL: 'http://192.168.1.8:4000'
});

axiosInstance.interceptors.request.use(async function (config) {
  let token = await AsyncStorage.getItem('token');
  token = token ? JSON.parse(token) : '';

  config.headers.Authorization = `${token}`;
  return config;
});

// prod - http://216.107.136.206:4000
// stag - https://e-commerce-d01f.onrender.com
// local - http://192.168.1.8:4000
export default axiosInstance;
