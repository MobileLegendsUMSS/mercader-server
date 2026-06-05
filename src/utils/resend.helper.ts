import { env } from "../config/env.config"
import { resend } from "../config/resend.config";
import { toBoliviaTime } from "./date.helper"

export async function sendOverdueEmail(
  targetMail: string,
  userName: string,
  gameTitle: string,
  limitDate: Date) {
  const formatedLimitDate = toBoliviaTime(limitDate.toISOString());

  await resend.emails.send({
    from: env.SEND_USER,
    to: targetMail,
    subject: "Préstamo vencido - Devolución requerida",
    html: `
      <h2>Hola, ${userName}</h2>
      <p>Tu préstamo del juego <strong>${gameTitle}</strong> venció el 
      <strong>${formatedLimitDate}</strong> y aún no ha sido devuelto.</p>
      <p>Por favor acércate a devolver el juego a la brevedad posible.</p>
      <p><strong>Se aplicará una multa por cada día de retraso.</strong></p>
    `
  });

  /*
  await transporter.sendMail({
    from: env.SEND_USER,
    to: targetMail,
    subject: "Préstamo vencido - Devolución requerida",
    html: `
      <h2>Hola, ${userName}</h2>
      <p>Tu préstamo del juego <strong>${gameTitle}</strong> venció el 
      <strong>${formatedLimitDate}</strong> y aún no ha sido devuelto.</p>
      <p>Por favor acércate a devolver el juego a la brevedad posible.</p>
      <p><strong>Se aplicará una multa por cada día de retraso.</strong></p>
    `
  });
  */
}