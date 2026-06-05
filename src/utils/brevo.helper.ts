import { env } from "../config/env.config"
import { brevo } from "../config/brevo.config";
import { toBoliviaTime } from "./date.helper"

export async function sendOverdueEmail(
  targetMail: string,
  userName: string,
  gameTitle: string,
  limitDate: Date) {
  try {
    const formatedLimitDate = toBoliviaTime(limitDate.toISOString());

    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: `Recordatorio sobre tu juego: ${gameTitle}`,
      htmlContent: `
        <h1>Hola, ${userName}</h1>
        <h2>Préstamo vencido - Devolución requerida</h2>
        <p>Tu préstamo del juego <strong>${gameTitle}</strong> venció el 
        <strong>${formatedLimitDate}</strong> y aún no ha sido devuelto.</p>
        <p>Por favor acércate a devolver el juego a la brevedad posible.</p>
        <p><strong>Se aplicará una multa por cada día de retraso.</strong></p>
      `,
      sender: { name: env.SEND_USER, email: env.SEND_EMAIL_USER },
      to: [{ email: targetMail, name: userName }] 
    });

    console.log(result);
  } catch (err) {
    throw new Error(`Error al enviar correo electronico: ${(err as Error).message}`);
  }
}