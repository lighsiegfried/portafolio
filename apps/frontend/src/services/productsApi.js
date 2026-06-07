import { get, post, patch } from './api';

export function list(params) {
  return get('/products', params);
}

export function create(data) {
  return post('/products', data);
}

export function update(id, data) {
  return patch(`/products/${id}`, data);
}

export function updateStock(id, data) {
  return patch(`/products/${id}/stock`, data);
}
