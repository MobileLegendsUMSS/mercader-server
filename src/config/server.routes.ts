import { Router, Request, Response } from "express";
import juegoRoutes from '../routes/juego.routes';
import categoriaRoutes from '../routes/categoria.routes';
import dificultadRoutes from '../routes/dificultad.routes';
import editorialRoutes from '../routes/editorial.routes';

const router = Router();

router.use('/api/juegos', juegoRoutes);
router.use('/api/categorias', categoriaRoutes);
router.use('/api/dificultades', dificultadRoutes);
router.use('/api/editoriales', editorialRoutes);

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