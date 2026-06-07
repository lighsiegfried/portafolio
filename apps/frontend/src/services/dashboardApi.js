import { get } from './api';

export function getSummary() {
  return get('/dashboard/summary');
}
