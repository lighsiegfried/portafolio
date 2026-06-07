const response = require('../../utils/response');
const logger = require('../../middleware/logger');
const { getRepository } = require('../../db/repositoryFactory');
const { validate } = require('./validator');
const { sendInternalContactEmail, sendVisitorConfirmationEmail } = require('./service');

const repo = getRepository();

async function submit(event) {
  try {
    const sanitized = validate(event.body);

    logger.log('INFO', 'contact', 'submit', `Mensaje recibido de ${sanitized.name} <${sanitized.email}>`);

    const record = repo.create('contactMessages', {
      name: sanitized.name,
      email: sanitized.email,
      message: sanitized.message,
      source: 'Portafolio Web',
      status: 'received',
      sesMessageId: null,
      confirmationSent: false,
    });

    logger.log('INFO', 'contact', 'saved', `Contacto guardado [${record.id}] con status received`);

    try {
      const sesResult = await sendInternalContactEmail({
        name: sanitized.name,
        email: sanitized.email,
        message: sanitized.message,
        messageId: record.id,
      });

      const updates = {
        status: 'email_sent',
        sesMessageId: sesResult.sesMessageId,
      };

      const sendConfirmation = process.env.SEND_CONTACT_CONFIRMATION === 'true';

      if (sendConfirmation) {
        const confirmationResult = await sendVisitorConfirmationEmail({
          name: sanitized.name,
          email: sanitized.email,
        });
        updates.confirmationSent = true;
        updates.confirmationMessageId = confirmationResult.confirmationMessageId;
      }

      repo.update('contactMessages', record.id, updates);

      logger.log('INFO', 'contact', 'sent',
        `Contacto [${record.id}] SES=${sesResult.sesMessageId} confirmación=${sendConfirmation}`
      );
    } catch (sesError) {
      repo.update('contactMessages', record.id, { status: 'email_failed' });
      logger.log('ERROR', 'contact', 'ses_failed',
        `Contacto [${record.id}] guardado pero SES falló: ${sesError.message}`,
        { stack: sesError.stack }
      );
    }

    return response.success({
      message: 'Mensaje recibido correctamente',
    });
  } catch (err) {
    logger.log('ERROR', 'contact', 'send_failed', err.message, { stack: err.stack });
    return response.error(500, 'CONTACT_SEND_FAILED', 'No se pudo enviar el mensaje en este momento');
  }
}

module.exports = { submit };
