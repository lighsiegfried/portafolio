import { downloadCsv } from './api';

export function downloadRequisitions() {
  return downloadCsv('/reports/requisitions.csv');
}

export function downloadInventory() {
  return downloadCsv('/reports/inventory.csv');
}

export function downloadLeads() {
  return downloadCsv('/reports/leads.csv');
}
