import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendAccessRequestEmail(user) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
    console.warn('Correo no enviado: faltan RESEND_API_KEY o ADMIN_EMAIL');
    return { skipped: true };
  }

  const appUrl = process.env.APP_URL || 'http://localhost:4000';
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5">
      <h2>Nueva solicitud de acceso a RotulaPro</h2>
      <p><strong>Nombre:</strong> ${user.name}</p>
      <p><strong>Correo:</strong> ${user.email}</p>
      <p><strong>Teléfono:</strong> ${user.phone || '-'}</p>
      <p><strong>Cargo solicitado:</strong> ${user.requested_role}</p>
      <p>Entra al panel de usuarios para aprobar, rechazar o cambiar jerarquía.</p>
      <a href="${appUrl}" style="background:#f97316;color:#111827;padding:12px 16px;border-radius:10px;text-decoration:none;font-weight:bold">Abrir RotulaPro</a>
    </div>
  `;

  return resend.emails.send({
    from: process.env.RESEND_FROM || 'RotulaPro <onboarding@resend.dev>',
    to: process.env.ADMIN_EMAIL,
    subject: 'Nueva solicitud de acceso a RotulaPro',
    html
  });
}
