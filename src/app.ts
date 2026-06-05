import "./config/env.config";
import { app } from "./config/server.config";
import { env } from "./config/env.config";
import { connectDB } from "./config/database.config";

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(env.PORT, () => {
      console.log(`Servidor escuchando en el puerto: ${env.PORT}`);
      console.log(`Servidor funcionando en: http://localhost:${env.PORT}/health`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();