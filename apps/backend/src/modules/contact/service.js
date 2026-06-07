const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
const logger = require('../../middleware/logger');

const sesClient = new SESv2Client({
  region: process.env.SES_REGION || process.env.AWS_REGION || 'us-east-1',
});

async function sendEmail({ from, to, replyTo, subject, html }) {
  const params = {
    FromEmailAddress: from,
    Destination: {
      ToAddresses: [to],
    },
    Content: {
      Simple: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Html: { Data: html, Charset: 'UTF-8' },
        },
      },
    },
  };

  if (replyTo) {
    params.ReplyToAddresses = [replyTo];
  }

  const command = new SendEmailCommand(params);
  const result = await sesClient.send(command);
  return result;
}

async function sendInternalContactEmail({ name, email, message, messageId }) {
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const replyToEnabled = process.env.CONTACT_REPLY_TO_ENABLED !== 'false';

  if (!fromEmail || !toEmail) {
    throw new Error('CONTACT_FROM_EMAIL y CONTACT_TO_EMAIL deben estar configurados');
  }

  const { internalNotification } = require('./emailTemplates');

  const date = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const internal = internalNotification({ name, email, message, date, messageId });

  logger.log('INFO', 'contact', 'send_internal', `Enviando notificación a ${toEmail}`);

  const internalResult = await sendEmail({
    from: fromEmail,
    to: toEmail,
    replyTo: replyToEnabled ? email : undefined,
    subject: internal.subject,
    html: internal.html,
  });

  return { sesMessageId: internalResult.MessageId };
}

async function sendVisitorConfirmationEmail({ name, email }) {
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  const { visitorConfirmation } = require('./emailTemplates');

  const confirmation = visitorConfirmation({ name });

  logger.log('INFO', 'contact', 'send_confirmation', `Enviando confirmación a ${email}`);

  const result = await sendEmail({
    from: fromEmail,
    to: email,
    subject: confirmation.subject,
    html: confirmation.html,
  });

  return { confirmationMessageId: result.MessageId };
}

module.exports = { sendEmail, sendInternalContactEmail, sendVisitorConfirmationEmail };
