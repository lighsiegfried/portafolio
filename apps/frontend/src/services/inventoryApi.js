import { get, post } from './api';

export function listMovements(params) {
  return get('/inventory/movements', params);
}

export function lowStock() {
  return get('/inventory/low-stock');
}

export function createMovement(data) {
  return post('/inventory/movements', data);
}
