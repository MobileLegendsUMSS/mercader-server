import { Request, Response } from "express";
import * as AdminService from "../services/admin.service";

export async function cambiarRol(req: Request, res: Response) {
  try {
    const { id_usuario, nuevo_rol } = req.body;

    if (!id_usuario || !nuevo_rol) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario y nuevo rol son requeridos"
      });
    }

    // validar roles permitidos (solo admin puede cambiar a usuario o admin)
    const rolesPermitidos = ['usuario', 'admin'];
    if (!rolesPermitidos.includes(nuevo_rol)) {
      return res.status(400).json({
        success: false,
        message: `Rol inválido. Roles permitidos: ${rolesPermitidos.join(', ')}`
      });
    }

    const resultado = await AdminService.cambiarRolUsuario(id_usuario, nuevo_rol);

    return res.status(200).json({
      success: true,
      message: resultado.message,
      requiereLogout: resultado.requiereLogout,
      data: resultado.usuario
    });
  } catch (error: any) {
    console.error('Error al cambiar rol:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error al cambiar el rol del usuario"
    });
  }
}

export async function listarUsuarios(req: Request, res: Response) {
  try {
    const usuarios = await AdminService.obtenerUsuariosConRoles();
    
    return res.status(200).json({
      success: true,
      data: usuarios
    });
  } catch (error: any) {
    console.error('Error al listar usuarios:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error al obtener la lista de usuarios"
    });
  }
}

// degradar de superadmin a admin (solo para superadmin)
export async function degradarSuperAdmin(req: Request, res: Response) {
  try {
    const { id_usuario } = req.body;
    
    if (!id_usuario) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario requerido"
      });
    }

    const resultado = await AdminService.cambiarRolUsuario(id_usuario, 'admin');
    
    return res.status(200).json({
      success: true,
      message: `Superadmin degradado a admin. ${resultado.message}`,
      requiereLogout: resultado.requiereLogout
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error al degradar superadmin"
    });
  }
}