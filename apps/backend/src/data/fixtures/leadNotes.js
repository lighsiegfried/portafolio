const { IDS } = require('./ids');

const leadNotes = [
  // L1 — Tacos El Norteño (won)
  { id: IDS.LN1,  leadId: IDS.L1, content: 'Primer contacto — enviaron correo solicitando cotización de harina y aceite', createdBy: IDS.U2, createdAt: '2026-01-16T00:00:00.000Z' },
  { id: IDS.LN2,  leadId: IDS.L1, content: 'Reunión en sus oficinas — muy interesados en compras recurrentes', createdBy: IDS.U2, createdAt: '2026-01-25T00:00:00.000Z' },
  { id: IDS.LN3,  leadId: IDS.L1, content: 'Contrato firmado — cliente ganado', createdBy: IDS.U1, createdAt: '2026-03-01T00:00:00.000Z' },

  // L2 — Panadería La Espiga (in_contact)
  { id: IDS.LN4,  leadId: IDS.L2, content: 'Llamada inicial — atiende el gerente de compras', createdBy: IDS.U2, createdAt: '2026-02-05T00:00:00.000Z' },
  { id: IDS.LN5,  leadId: IDS.L2, content: 'Enviada cotización de harina y aceite a granel', createdBy: IDS.U2, createdAt: '2026-02-10T00:00:00.000Z' },
  { id: IDS.LN6,  leadId: IDS.L2, content: 'Solicitaron muestras de harina — envío programado', createdBy: IDS.U2, createdAt: '2026-03-01T00:00:00.000Z' },

  // L3 — Metalmecánica Superior (lost)
  { id: IDS.LN7,  leadId: IDS.L3, content: 'Llamada de prospección — atiende jefe de compras', createdBy: IDS.U2, createdAt: '2026-02-20T00:00:00.000Z' },
  { id: IDS.LN8,  leadId: IDS.L3, content: 'Enviada cotización de acero inoxidable', createdBy: IDS.U2, createdAt: '2026-03-01T00:00:00.000Z' },
  { id: IDS.LN9,  leadId: IDS.L3, content: 'Cliente perdido — eligieron a competidor con mejor precio', createdBy: IDS.U2, createdAt: '2026-04-10T00:00:00.000Z' },

  // L4 — Constructora Moderna (negotiation)
  { id: IDS.LN10, leadId: IDS.L4, content: 'Contacto vía web — solicitud de cotización de materiales', createdBy: IDS.U2, createdAt: '2026-03-05T00:00:00.000Z' },
  { id: IDS.LN11, leadId: IDS.L4, content: 'Reunión virtual con director de obra', createdBy: IDS.U2, createdAt: '2026-03-20T00:00:00.000Z' },

  // L5 — Taller Eléctrico Rapid (new)
  { id: IDS.LN12, leadId: IDS.L5, content: 'Solicitud de cotización recibida por formulario web', createdBy: IDS.U2, createdAt: '2026-06-01T00:00:00.000Z' },

  // L6 — Empaque Total (in_contact)
  { id: IDS.LN13, leadId: IDS.L6, content: 'Llamada de seguimiento — interesados en polietileno grado industrial', createdBy: IDS.U2, createdAt: '2026-04-10T00:00:00.000Z' },

  // L7 — Reparaciones GM (negotiation)
  { id: IDS.LN14, leadId: IDS.L7, content: 'Referido por cliente actual — contactaron para mantenimiento', createdBy: IDS.U3, createdAt: '2026-04-25T00:00:00.000Z' },
  { id: IDS.LN15, leadId: IDS.L7, content: 'Propuesta de contrato trimestral enviada', createdBy: IDS.U3, createdAt: '2026-05-10T00:00:00.000Z' },

  // L8 — Oficinas Ejecutivas Centro (lost)
  { id: IDS.LN16, leadId: IDS.L8, content: 'Llamada en frío — solicitaron cotización de papel y tóner', createdBy: IDS.U4, createdAt: '2026-05-05T00:00:00.000Z' },

  // L10 — Papelería La Pluma (new)
  { id: IDS.LN17, leadId: IDS.L10, content: 'Solicitud de catálogo recibida por web', createdBy: IDS.U2, createdAt: '2026-06-05T00:00:00.000Z' },
];

module.exports = { leadNotes };
