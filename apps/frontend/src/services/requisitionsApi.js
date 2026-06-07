import { get, post, patch } from './api';

export function list(params) {
  return get('/requisitions', params);
}

export function getById(id) {
  return get(`/requisitions/${id}`);
}

export function create(data) {
  return post('/requisitions', data);
}

export function approve(id) {
  return patch(`/requisitions/${id}/approve`);
}

export function reject(id, reason) {
  return patch(`/requisitions/${id}/reject`, { reason });
}

export function complete(id) {
  return patch(`/requisitions/${id}/complete`);
}
