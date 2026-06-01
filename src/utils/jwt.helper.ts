import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida. Agrega JWT_SECRET en tu .env.');
}

interface TokenData {
  id_usuario: string;
  nombre: string;
  rol?: string;
}

export const generateToken = (data: TokenData): string => {
  return jwt.sign(
    {
      id_usuario: data.id_usuario,
      nombre: data.nombre,
      rol: data.rol
    },
    JWT_SECRET,
    { expiresIn: '15d' }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};