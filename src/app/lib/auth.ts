import axios from 'axios';
import { setAuthToken } from './central';
import { AuthResponse } from './types';

export function persistAuth(data: AuthResponse) {
  setAuthToken(data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
}


export function logout() {
  localStorage.removeItem('user');
  setAuthToken(undefined);
}

export function bootstrapAuth() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    console.log('token', token);

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}
