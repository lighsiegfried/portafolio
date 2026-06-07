import { get, post, patch } from './api';

export function list(params) {
  return get('/leads', params);
}

export function getById(id) {
  return get(`/leads/${id}`);
}

export function create(data) {
  return post('/leads', data);
}

export function update(id, data) {
  return patch(`/leads/${id}`, data);
}

export function addNote(id, content) {
  return post(`/leads/${id}/notes`, { content });
}
