import api from './api';

export const login = async (email, contrasena) => {
  const response = await api.post('/auth/login', { email, contrasena });
  return response.data;
};

export const registro = async (datos) => {
  const response = await api.post('/auth/registro', datos);
  return response.data;
};