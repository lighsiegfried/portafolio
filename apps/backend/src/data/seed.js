const bcrypt = require('bcryptjs');
const { generateId } = require('../utils/idGenerator');

const SALT_ROUNDS = 10;

function hashPassword(plain) {
  return bcrypt.hashSync(plain, SALT_ROUNDS);
}

const u1 = generateId();
const u2 = generateId();
const u3 = generateId();
const u4 = generateId();

const users = [
  { id: u1, username: 'wilson', passwordHash: hashPassword('admin1234'), name: 'Wilson Vásquez', email: 'wilson@example.com', role: 'admin', active: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: u2, username: 'compras1', passwordHash: hashPassword('compras1234'), name: 'María García', email: 'compras@example.com', role: 'compras', active: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: u3, username: 'bodega1', passwordHash: hashPassword('bodega1234'), name: 'Carlos López', email: 'bodega@example.com', role: 'bodega', active: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: u4, username: 'gerencia1', passwordHash: hashPassword('gerencia1234'), name: 'Ana Martínez', email: 'gerencia@example.com', role: 'gerencia', active: true, createdAt: '2026-01-01T00:00:00.000Z' },
];

const p1 = generateId();
const p2 = generateId();
const p3 = generateId();
const p4 = generateId();
const p5 = generateId();

const products = [
  { id: p1, sku: 'PAP-A4-001', name: 'Resma Papel Carta', description: 'Papel bond blanco 75g, 500 hojas', category: 'insumo', stock: 50, minStock: 10, unit: 'unidad', price: 5.50, active: true, createdAt: '2026-01-15T00:00:00.000Z', updatedAt: '2026-01-15T00:00:00.000Z' },
  { id: p2, sku: 'TON-HP-001', name: 'Tóner HP LaserJet', description: 'Tóner negro para HP LaserJet Pro M404', category: 'insumo', stock: 5, minStock: 3, unit: 'unidad', price: 45.00, active: true, createdAt: '2026-01-15T00:00:00.000Z', updatedAt: '2026-01-15T00:00:00.000Z' },
  { id: p3, sku: 'CAR-001', name: 'Carpeta Manila Oficio', description: 'Carpeta manila tamaño oficio, pack 50', category: 'insumo', stock: 200, minStock: 50, unit: 'pack', price: 3.25, active: true, createdAt: '2026-01-15T00:00:00.000Z', updatedAt: '2026-01-15T00:00:00.000Z' },
  { id: p4, sku: 'LAP-001', name: 'Laptop Dell Latitude 3420', description: 'Laptop corporativa i5, 16GB RAM, 256GB SSD', category: 'equipo', stock: 2, minStock: 5, unit: 'unidad', price: 850.00, active: true, createdAt: '2026-02-01T00:00:00.000Z', updatedAt: '2026-02-01T00:00:00.000Z' },
  { id: p5, sku: 'MON-001', name: 'Monitor LG 24"', description: 'Monitor LED 24 pulgadas Full HD', category: 'equipo', stock: 3, minStock: 2, unit: 'unidad', price: 180.00, active: true, createdAt: '2026-02-01T00:00:00.000Z', updatedAt: '2026-02-01T00:00:00.000Z' },
];

const r1 = generateId();
const r2 = generateId();

const requisitions = [
  { id: r1, number: 'REQ-0001', title: 'Compra de insumos de oficina', description: 'Resmas de papel, tóners y carpetas para el mes', status: 'approved', rejectionReason: null, createdBy: u1, approvedBy: u4, completedBy: null, completedAt: null, createdAt: '2026-05-01T10:00:00.000Z', updatedAt: '2026-05-02T14:00:00.000Z' },
  { id: r2, number: 'REQ-0002', title: 'Actualización de equipos informáticos', description: 'Laptops y monitores para el equipo de desarrollo', status: 'pending', rejectionReason: null, createdBy: u2, approvedBy: null, completedBy: null, completedAt: null, createdAt: '2026-05-15T09:00:00.000Z', updatedAt: '2026-05-15T09:00:00.000Z' },
];

const requisitionItems = [
  { id: generateId(), requisitionId: r1, productName: products[0].name, quantity: 10, unit: products[0].unit, estimatedCost: products[0].price, observations: null },
  { id: generateId(), requisitionId: r1, productName: products[1].name, quantity: 2, unit: products[1].unit, estimatedCost: products[1].price, observations: null },
];

const inventoryMovements = [
  { id: generateId(), productId: p1, type: 'IN', quantity: 50, stockBefore: 0, stockAfter: 50, reference: 'Compra inicial', notes: 'Stock inicial de papel', createdBy: u3, createdAt: '2026-01-15T08:00:00.000Z' },
  { id: generateId(), productId: p1, type: 'OUT', quantity: 5, stockBefore: 50, stockAfter: 45, reference: 'Uso interno', notes: 'Entrega a oficina', createdBy: u3, createdAt: '2026-02-01T10:00:00.000Z' },
];

const l1 = generateId();
const l2 = generateId();
const l3 = generateId();

const leads = [
  { id: l1, companyName: 'TechSolutions S.A.', contactName: 'Carlos Mendoza', email: 'cmendoza@techsolutions.com', phone: '+54 11 5555-1234', status: 'negotiation', source: 'referencia', nextFollowUp: '2026-06-20', assignedTo: u4, notes: 'Cliente interesado en consultoría cloud', createdAt: '2026-05-10T00:00:00.000Z', updatedAt: '2026-05-20T00:00:00.000Z' },
  { id: l2, companyName: 'Innovación Digital Ltda.', contactName: 'Laura Jiménez', email: 'ljimenez@innovaciondigital.com', phone: '+57 1 555-6789', status: 'in_contact', source: 'web', nextFollowUp: '2026-06-25', assignedTo: u1, notes: 'Solicitó información sobre ERP', createdAt: '2026-05-25T00:00:00.000Z', updatedAt: '2026-05-25T00:00:00.000Z' },
  { id: l3, companyName: 'Grupo Empresarial Centro', contactName: 'Roberto Sánchez', email: 'rsanchez@grupo-centro.com', phone: '+502 2 555-4321', status: 'new', source: 'llamada', nextFollowUp: '2026-06-15', assignedTo: u1, notes: 'Llamada inicial, enviar propuesta', createdAt: '2026-06-01T00:00:00.000Z', updatedAt: '2026-06-01T00:00:00.000Z' },
];

const leadNotes = [
  { id: generateId(), leadId: l1, content: 'Nota inicial para Carlos Mendoza. Seguimiento programado para 2026-06-20.', createdBy: u1, createdAt: leads[0].createdAt },
  { id: generateId(), leadId: l2, content: 'Nota inicial para Laura Jiménez. Seguimiento programado para 2026-06-25.', createdBy: u1, createdAt: leads[1].createdAt },
  { id: generateId(), leadId: l3, content: 'Nota inicial para Roberto Sánchez. Seguimiento programado para 2026-06-15.', createdBy: u1, createdAt: leads[2].createdAt },
];

const auditEvents = [];

module.exports = {
  users, products, requisitions, requisitionItems,
  inventoryMovements, leads, leadNotes, auditEvents,
};
