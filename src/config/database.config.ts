import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as path from "path";

//dotenv.config();

dotenv.config({ path: path.join(process.cwd(), ".env") });


export async function connectDB() {
  try {
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.DB_URL
      : process.env.DB_URL;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI no definida en variables de entorno');
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB conectado exitosamente');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB desconectado');
  process.exit(0);
});