const { IDS } = require('./ids');

const users = [
  {
    id: IDS.U1,
    username: 'wilson',
    passwordHash: '$2a$10$HkaDAa2LR.8d/.nTQrp7PeQjcjRUTPXhFdMpKsRfz00MtW7ukvWbC',
    role: 'admin',
    name: 'Carlos Admin',
    email: 'carlos@erp.local',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: IDS.U2,
    username: 'compras1',
    passwordHash: '$2a$10$UsTVrZZNQffTubtPIc0rZeJ74B0LCPYpPdDS5RDSsmcDQiixxljv.',
    role: 'compras',
    name: 'María Compras',
    email: 'maria@erp.local',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: IDS.U3,
    username: 'bodega1',
    passwordHash: '$2a$10$7QIZXVSXc4.G6u1fPgnkYOfsI1.2YatQ9bXxtbIzjHbysVsTLUSvq',
    role: 'bodega',
    name: 'José Bodega',
    email: 'jose@erp.local',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: IDS.U4,
    username: 'gerencia1',
    passwordHash: '$2a$10$r/cvzSbi85eZ0MFKqHokKuo.0/cMtoC7jSwzcQke/lmI89QQxyqw.',
    role: 'gerencia',
    name: 'Ana Gerencia',
    email: 'ana@erp.local',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

module.exports = { users };
