const { IDS } = require('./ids');

const inventoryMovements = [
  // Initial stock IN movements for each product (January)
  { id: IDS.IM1,  productId: IDS.P1,  type: 'IN',  quantity: 150, stockBefore: 0,   stockAfter: 150, createdBy: IDS.U3, reason: 'Inventario inicial',                  createdAt: '2026-01-01T00:00:00.000Z' },
  { id: IDS.IM2,  productId: IDS.P2,  type: 'IN',  quantity: 50,  stockBefore: 0,   stockAfter: 50,  createdBy: IDS.U3, reason: 'Inventario inicial',                  createdAt: '2026-01-01T00:00:00.000Z' },
  { id: IDS.IM3,  productId: IDS.P3,  type: 'IN',  quantity: 60,  stockBefore: 0,   stockAfter: 60,  createdBy: IDS.U3, reason: 'Inventario inicial',                  createdAt: '2026-01-01T00:00:00.000Z' },
  { id: IDS.IM4,  productId: IDS.P4,  type: 'IN',  quantity: 300, stockBefore: 0,   stockAfter: 300, createdBy: IDS.U3, reason: 'Inventario inicial',                  createdAt: '2026-01-01T00:00:00.000Z' },
  { id: IDS.IM5,  productId: IDS.P5,  type: 'IN',  quantity: 50,  stockBefore: 0,   stockAfter: 50,  createdBy: IDS.U3, reason: 'Inventario inicial',                  createdAt: '2026-01-01T00:00:00.000Z' },
  { id: IDS.IM6,  productId: IDS.P6,  type: 'IN',  quantity: 25,  stockBefore: 0,   stockAfter: 25,  createdBy: IDS.U3, reason: 'Inventario inicial',                  createdAt: '2026-01-01T00:00:00.000Z' },
  { id: IDS.IM7,  productId: IDS.P7,  type: 'IN',  quantity: 10,  stockBefore: 0,   stockAfter: 10,  createdBy: IDS.U3, reason: 'Inventario inicial',                  createdAt: '2026-01-01T00:00:00.000Z' },
  { id: IDS.IM8,  productId: IDS.P8,  type: 'IN',  quantity: 5,   stockBefore: 0,   stockAfter: 5,   createdBy: IDS.U3, reason: 'Inventario inicial',                  createdAt: '2026-01-01T00:00:00.000Z' },
  { id: IDS.IM9,  productId: IDS.P9,  type: 'IN',  quantity: 10,  stockBefore: 0,   stockAfter: 10,  createdBy: IDS.U3, reason: 'Inventario inicial (horas)',           createdAt: '2026-01-01T00:00:00.000Z' },
  { id: IDS.IM10, productId: IDS.P10, type: 'IN',  quantity: 20,  stockBefore: 0,   stockAfter: 20,  createdBy: IDS.U3, reason: 'Inventario inicial (horas)',           createdAt: '2026-01-01T00:00:00.000Z' },
  { id: IDS.IM11, productId: IDS.P11, type: 'IN',  quantity: 30,  stockBefore: 0,   stockAfter: 30,  createdBy: IDS.U3, reason: 'Inventario inicial',                  createdAt: '2026-01-01T00:00:00.000Z' },
  { id: IDS.IM12, productId: IDS.P12, type: 'IN',  quantity: 10,  stockBefore: 0,   stockAfter: 10,  createdBy: IDS.U3, reason: 'Inventario inicial',                  createdAt: '2026-01-01T00:00:00.000Z' },

  // Consumption OUT movements (January–June)
  { id: IDS.IM13, productId: IDS.P1,  type: 'OUT', quantity: 50,  stockBefore: 150, stockAfter: 100, createdBy: IDS.U3, reason: 'Consumo producción enero',             createdAt: '2026-01-15T00:00:00.000Z' },
  { id: IDS.IM14, productId: IDS.P2,  type: 'OUT', quantity: 15,  stockBefore: 50,  stockAfter: 35,  createdBy: IDS.U3, reason: 'Consumo producción enero',             createdAt: '2026-01-15T00:00:00.000Z' },
  { id: IDS.IM15, productId: IDS.P3,  type: 'OUT', quantity: 20,  stockBefore: 60,  stockAfter: 40,  createdBy: IDS.U3, reason: 'Consumo producción enero',             createdAt: '2026-01-15T00:00:00.000Z' },
  { id: IDS.IM16, productId: IDS.P4,  type: 'OUT', quantity: 100, stockBefore: 300, stockAfter: 200, createdBy: IDS.U3, reason: 'Consumo producción febrero',            createdAt: '2026-02-15T00:00:00.000Z' },
  { id: IDS.IM17, productId: IDS.P5,  type: 'OUT', quantity: 20,  stockBefore: 50,  stockAfter: 30,  createdBy: IDS.U3, reason: 'Consumo producción febrero',            createdAt: '2026-02-15T00:00:00.000Z' },
  { id: IDS.IM18, productId: IDS.P6,  type: 'OUT', quantity: 23,  stockBefore: 25,  stockAfter: 2,   createdBy: IDS.U3, reason: 'Consumo producción marzo',              createdAt: '2026-03-20T00:00:00.000Z' },
  { id: IDS.IM19, productId: IDS.P11, type: 'OUT', quantity: 23,  stockBefore: 30,  stockAfter: 7,   createdBy: IDS.U3, reason: 'Uso oficinas Q1',                       createdAt: '2026-03-30T00:00:00.000Z' },
  { id: IDS.IM20, productId: IDS.P12, type: 'OUT', quantity: 6,   stockBefore: 10,  stockAfter: 4,   createdBy: IDS.U3, reason: 'Reemplazo tóners agotados',              createdAt: '2026-05-10T00:00:00.000Z' },
];

module.exports = { inventoryMovements };
