import { Types } from 'mongoose';
import { Usuario } from '../models/usuario.model';
import { UsuarioRol } from '../models/usuarioRol.model';
import { Rol } from '../models/rol.model';
import { RefreshToken } from '../models/refreshToken.model';

export async function cambiarRolUsuario(idUsuario: string, nuevoRolNombre: string) {
  try {
    // validar que el usuario existe
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // validar que el nuevo rol existe
    const nuevoRol = await Rol.findOne({ nombre_rol: nuevoRolNombre });
    if (!nuevoRol) {
      throw new Error('Rol no encontrado');
    }

    // obtener rol actual
    const usuarioRolActual = await UsuarioRol.findOne({ id_usuario: usuario._id });
    if (!usuarioRolActual) {
      throw new Error('El usuario no tiene un rol asignado');
    }

    const rolActual = await Rol.findById(usuarioRolActual.id_rol);
    if (!rolActual) {
      throw new Error('Rol actual no encontrado');
    }

    // Si el rol es el mismo no hacer nada
    if (rolActual.nombre_rol === nuevoRolNombre) {
      return {
        success: true,
        message: 'El usuario ya tiene este rol',
        requiereLogout: false
      };
    }

    // actualizar rol
    usuarioRolActual.id_rol = nuevoRol._id;
    await usuarioRolActual.save();

    // invalida los los refresh tokens del us
    // fuerza el logout en el proximo refresh
    await RefreshToken.updateMany(
      { id_usuario: usuario._id, revoked: false },
      { 
        revoked: true,
        revokedAt: new Date(),
        revokedReason: 'Rol cambiado'
      }
    );

    return {
      success: true,
      message: `Rol cambiado de ${rolActual.nombre_rol} a ${nuevoRolNombre}`,
      requiereLogout: true,
      usuario: {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        rolAnterior: rolActual.nombre_rol,
        rolNuevo: nuevoRolNombre
      }
    };
  } catch (error) {
    throw error;
  }
}

export async function obtenerUsuariosConRoles() {
  try {
    const usuariosConRoles = await Usuario.aggregate([
      {
        $lookup: {
          from: 'usuario_rol',
          localField: '_id',
          foreignField: 'id_usuario',
          as: 'usuarioRol'
        }
      },
      {
        $unwind: {
          path: '$usuarioRol',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $lookup: {
          from: 'rol',
          localField: 'usuarioRol.id_rol',
          foreignField: '_id',
          as: 'rol'
        }
      },
      {
        $unwind: {
          path: '$rol',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          _id: 1,
          nombre: 1,
          nombres: 1,
          apellidos: 1,
          telefono: 1,
          correo_contacto: 1,
          mercapoints: 1,
          rol: '$rol.nombre_rol',
          rolId: '$rol._id'
        }
      }
    ]);

    return usuariosConRoles;
  } catch (error) {
    throw error;
  }
}