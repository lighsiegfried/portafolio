const { IDS } = require('./ids');

const requisitionItems = [
  // R1 — 3 items
  { id: IDS.RI1,  requisitionId: IDS.R1, productId: IDS.P1, quantity: 50,  estimatedCost: 925.00,  observations: null },
  { id: IDS.RI2,  requisitionId: IDS.R1, productId: IDS.P2, quantity: 30,  estimatedCost: 660.00,  observations: null },
  { id: IDS.RI3,  requisitionId: IDS.R1, productId: IDS.P3, quantity: 20,  estimatedCost: 560.00,  observations: null },

  // R2 — 2 items
  { id: IDS.RI4,  requisitionId: IDS.R2, productId: IDS.P4, quantity: 100, estimatedCost: 4500.00, observations: 'Entrega urgente' },
  { id: IDS.RI5,  requisitionId: IDS.R2, productId: IDS.P5, quantity: 20,  estimatedCost: 6400.00, observations: null },

  // R3 — 2 items
  { id: IDS.RI6,  requisitionId: IDS.R3, productId: IDS.P7, quantity: 1,   estimatedCost: 2500.00, observations: 'Con maletín y accesorios' },
  { id: IDS.RI7,  requisitionId: IDS.R3, productId: IDS.P8, quantity: 1,   estimatedCost: 3800.00, observations: 'Modelo silencioso' },

  // R4 — 1 item
  { id: IDS.RI8,  requisitionId: IDS.R4, productId: IDS.P10, quantity: 10, estimatedCost: 6000.00, observations: '10 horas de consultoría' },

  // R5 — 2 items
  { id: IDS.RI9,  requisitionId: IDS.R5, productId: IDS.P11, quantity: 15, estimatedCost: 1275.00, observations: null },
  { id: IDS.RI10, requisitionId: IDS.R5, productId: IDS.P12, quantity: 2,  estimatedCost: 1300.00, observations: null },

  // R6 — 1 item
  { id: IDS.RI11, requisitionId: IDS.R6, productId: IDS.P6,  quantity: 50, estimatedCost: 9000.00, observations: 'Cobre de alta pureza' },

  // R7 — 1 item
  { id: IDS.RI12, requisitionId: IDS.R7, productId: IDS.P3,  quantity: 10, estimatedCost: 280.00,  observations: 'Urgente — desabasto crítico' },

  // R8 — 1 item
  { id: IDS.RI13, requisitionId: IDS.R8, productId: IDS.P7,  quantity: 1,  estimatedCost: 2500.00, observations: null },

  // R9 — 2 items (both are services)
  { id: IDS.RI14, requisitionId: IDS.R9, productId: IDS.P9,  quantity: 5,  estimatedCost: 1750.00, observations: 'Mantenimiento de prensa hidráulica' },
  { id: IDS.RI15, requisitionId: IDS.R9, productId: IDS.P10, quantity: 3,  estimatedCost: 1800.00, observations: 'Consultoría asociada' },

  // R10 — 2 items
  { id: IDS.RI16, requisitionId: IDS.R10, productId: IDS.P11, quantity: 10, estimatedCost: 850.00,  observations: null },
  { id: IDS.RI17, requisitionId: IDS.R10, productId: IDS.P12, quantity: 2,  estimatedCost: 1300.00, observations: null },

  // Extra items to reach 25 total — additional items for existing requisitions
  { id: IDS.RI18, requisitionId: IDS.R2, productId: IDS.P6,  quantity: 10, estimatedCost: 1800.00, observations: 'Prueba de lote pequeño' },
  { id: IDS.RI19, requisitionId: IDS.R1, productId: IDS.P1,  quantity: 25, estimatedCost: 462.50,  observations: 'Segundo pedido de harina' },
  { id: IDS.RI20, requisitionId: IDS.R5, productId: IDS.P11, quantity: 5,  estimatedCost: 425.00,  observations: 'Papel extra para informes' },
  { id: IDS.RI21, requisitionId: IDS.R3, productId: IDS.P5,  quantity: 2,  estimatedCost: 640.00,  observations: 'Base de acero para soporte' },
  { id: IDS.RI22, requisitionId: IDS.R9, productId: IDS.P8,  quantity: 1,  estimatedCost: 4500.00, observations: 'Compresor adicional para taller' },
  { id: IDS.RI23, requisitionId: IDS.R6, productId: IDS.P4,  quantity: 25, estimatedCost: 1125.00, observations: 'Material alternativo propuesto' },
  { id: IDS.RI24, requisitionId: IDS.R10, productId: IDS.P1,  quantity: 10, estimatedCost: 185.00,  observations: 'Insumo para cafetería' },
  { id: IDS.RI25, requisitionId: IDS.R4, productId: IDS.P9,  quantity: 2,  estimatedCost: 700.00,  observations: 'Diagnóstico adicional' },
];

module.exports = { requisitionItems };
