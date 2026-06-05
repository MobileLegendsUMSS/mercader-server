import nodeCron from "node-cron";
import { Prestamo } from "../models/prestamo.model";
import { PrestamoJuego } from "../models/prestamojuego.model";
import { Usuario } from "../models/usuario.model";
import { Juego } from "../models/juego.model";
import { sendOverdueEmail } from "../utils/brevo.helper";
import * as ServicioTypes from "../types/servicio.types";

nodeCron.schedule("* * * * *", async function checkExpiredLoans() {
  try {
    const today = new Date();
    console.log("Cron ejecutado", today);

    const expiredLoans = await Prestamo.find({
      fecha_limite: { $lt: today },
      fecha_inicio: { $exists: true },
      fecha_fin: { $exists: false },
      multado: { $ne: true }
    });

    for (const loan of expiredLoans) {
      const loanGame = await PrestamoJuego.findOne({
        id_prestamo: loan._id,
        servicio: ServicioTypes.TipoServicio.ALQUILER
      }, "id_juego servicio");
      if (!loanGame) {
        continue;
      }

      const foundGame = await Juego.findById(loanGame.id_juego, "titulo");
      if (!foundGame) {
        continue;
      }

      const foundUser = await Usuario.findById(loan.id_usuario, "nombre correo_contacto");
      if (!foundUser) {
        continue;
      }

      await sendOverdueEmail(
        foundUser.correo_contacto,
        foundUser.nombre,
        foundGame.titulo,
        loan.fecha_limite
      );
      await Prestamo.findByIdAndUpdate(loan._id, {
      $set: { multado: true }
      });
    }
  } catch (err) {
    throw new Error(`Error en el trabajo de prestamos vencidos: ${(err as Error).message}`);
  }
});