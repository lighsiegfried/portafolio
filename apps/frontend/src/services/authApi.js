import { post, get } from './api';

export function login(username, password) {
  return post('/auth/login', { username, password });
}

export function me() {
  return get('/auth/me');
}
