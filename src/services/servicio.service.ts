import { Types } from "mongoose";
import { Juego } from "../models/juego.model";
import { Servicio } from "../models/servicio.model";
import { ServicioJuego } from "../models/servicioJuego.model";
import * as ServiceTypes from "../types/servicio.types";

export async function registerService(idGame: Types.ObjectId, services: ServiceTypes.TipoServicio[]) {
  try {
    const foundGame = await Juego.findById(idGame);
    if (!foundGame) {
      return {
        result: false,
        statusCode: 404,
        messageState: "El juego no se ha registrado correctamente"
      };
    }

    const registeredServices: ServiceTypes.IServicioJuego[] | unknown[]  = []
    for (const service of services) {
      const foundService = await Servicio.findOne({
        nombre: service
      }, "_id");
      if (!foundService) {
        return {
          result: false,
          statusCode: 404,
          messageState: "El servicio relacionado no existe."
        };
      }
      const idService = foundService._id;

      const newService = { id_juego: idGame, id_servicio: idService };
      const registeredService = await ServicioJuego.create(newService);
      registeredServices.push(registeredService);
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Servicio creado exitosamente.",
      data: registeredServices
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno del servidor: ${(err as Error).message}`
    }
  }
}