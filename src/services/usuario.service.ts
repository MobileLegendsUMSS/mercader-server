import { Types } from "mongoose";
import { Usuario } from "../models/usuario.model";
import * as UsuarioTypes from "../types/usuario.types";

export async function getPersonalInfo(idUser: string) {
  try {
    const formatedIdUser = new Types.ObjectId(idUser);
    const foundUser = await Usuario.findById(formatedIdUser);
    if (!foundUser) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Usuario no encontrado."
      };
    }

    const data = {
      nombre: foundUser.nombre,
      telefono: foundUser.telefono,
      correo_contacto: foundUser.correo_contacto,
      mercapoints: foundUser.mercapoints
    };
    if (foundUser.nombres) {
      Object.assign(data, { nombres: foundUser.nombres });
    }
    if (foundUser.apellidos) {
      Object.assign(data, { apellidos: foundUser.apellidos });
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Los datos personales del usuario se han obtenido correctamente.",
      data: data
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}