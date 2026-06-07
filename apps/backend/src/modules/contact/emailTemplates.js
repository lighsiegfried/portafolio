function internalNotification({ name, email, message, date, messageId }) {
  const subject = `Nuevo contacto desde portafolio — ${name}`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #1a1a2e; border-bottom: 2px solid #e94560; padding-bottom: 10px;">
      Nuevo mensaje de contacto
    </h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; font-weight: bold; color: #555; width: 100px;">Nombre</td>
        <td style="padding: 8px;">${name}</td>
      </tr>
      <tr style="background: #f9f9f9;">
        <td style="padding: 8px; font-weight: bold; color: #555;">Email</td>
        <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold; color: #555;">Fecha</td>
        <td style="padding: 8px;">${date}</td>
      </tr>
      <tr style="background: #f9f9f9;">
        <td style="padding: 8px; font-weight: bold; color: #555;">Fuente</td>
        <td style="padding: 8px;">Portafolio Web</td>
      </tr>
    </table>
    <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #1a1a2e;">Mensaje</h3>
      <p style="white-space: pre-wrap;">${message}</p>
    </div>
  </div>
</body>
</html>`;

  return { subject, html };
}

function visitorConfirmation({ name }) {
  const subject = 'Gracias por contactar a Wilson Vásquez';

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #1a1a2e;">Hola ${name},</h2>
    <p>Gracias por contactarme. He recibido tu mensaje correctamente y te responderé lo antes posible.</p>
    <p>Por lo general respondo en un plazo de 24 a 48 horas hábiles.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="color: #888; font-size: 12px;">
      Este es un mensaje automático, por favor no respondas directamente a este correo.
    </p>
  </div>
</body>
</html>`;

  return { subject, html };
}

module.exports = { internalNotification, visitorConfirmation };
