import { Router, Request, Response } from "express";
import juegoRoutes from '../routes/juego.routes';
import categoriaRoutes from '../routes/categoria.routes';
import dificultadRoutes from '../routes/dificultad.routes';
import editorialRoutes from '../routes/editorial.routes';
import CarritoRoutes from '../routes/carrito.routes';
import CompraRoutes from "../routes/compra.routes";
import PrestamoRoutes from "../routes/prestamo.routes";
import AuthRoutes from "../routes/auth.routes";
import UsuarioRoutes from "../routes/usuario.routes";
import resenaRoutes from "../routes/resena.routes";

const router = Router();

// Rutas de autenticación
router.use('/api/auth', AuthRoutes);

// Rutas de juegos y categorías
router.use('/api/juegos', juegoRoutes);
router.use('/api/categorias', categoriaRoutes);
router.use('/api/dificultades', dificultadRoutes);
router.use('/api/editoriales', editorialRoutes);
router.use("/api/servicios", CarritoRoutes);
router.use("/api/servicios", CompraRoutes);
router.use("/api/servicios", PrestamoRoutes);
router.use("/api/perfil", UsuarioRoutes);
router.use("/api/resenas", resenaRoutes);

router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Servidor Backend mobile funcionando correctamente..."
  });
});

router.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Ruta no encontrada..." 
  });
})

export default router;