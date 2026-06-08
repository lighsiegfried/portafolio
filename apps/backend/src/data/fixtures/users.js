const { IDS } = require('./ids');

const users = [
  {
    id: IDS.U1,
    username: 'wilson',
    passwordHash: '$2a$10$VxC0xb6gDwEZ0bAPfYiMbOpLdBKZe3C9bCXxTynFXTGAzgsfIcpRe',
    role: 'admin',
    name: 'Carlos Admin',
    email: 'carlos@erp.local',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: IDS.U2,
    username: 'compras1',
    passwordHash: '$2a$10$b8JB2ubkv6mQbb1syqxF/.gwbQGT1uvQUgN1nIt0pwr.RMLhfxr1a',
    role: 'compras',
    name: 'María Compras',
    email: 'maria@erp.local',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: IDS.U3,
    username: 'bodega1',
    passwordHash: '$2a$10$q.TJdvehOMiEQzlRObpleOed6OSAIJmYxcsV7/Z.y7x6Fg2iCUqzO',
    role: 'bodega',
    name: 'José Bodega',
    email: 'jose@erp.local',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: IDS.U4,
    username: 'gerencia1',
    passwordHash: '$2a$10$xFdtruIK4ii.ALjZK/bJ3ezVvMhzb9FW1X6laF3IMCiown58yKVrq',
    role: 'gerencia',
    name: 'Ana Gerencia',
    email: 'ana@erp.local',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

module.exports = { users };
