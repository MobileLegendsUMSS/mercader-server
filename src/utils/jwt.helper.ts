import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida');
}
if (!REFRESH_SECRET) {
  throw new Error('La variable de entorno REFRESH_SECRET no está definida');
}

interface TokenData {
  id_usuario: string;
  nombre: string;
  rol?: string;
}

// Interfaz para el payload decodificado
interface AccessTokenPayload {
  id_usuario: string;
  nombre: string;
  rol?: string;
  type: 'access';
  iat: number;
  exp: number;
}

interface RefreshTokenPayload {
  id_usuario: string;
  type: 'refresh';
  iat: number;
  exp: number;
}

export const generateAccessToken = (data: TokenData): string => {
  return jwt.sign(
    {
      id_usuario: data.id_usuario,
      nombre: data.nombre,
      rol: data.rol,
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const generateRefreshToken = (data: { id_usuario: string }): string => {
  return jwt.sign(
    {
      id_usuario: data.id_usuario,
      type: 'refresh'
    },
    REFRESH_SECRET,
    { expiresIn: '15m' }
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
    if (decoded.type !== 'access') throw new Error('Token inválido');
    return decoded;
  } catch (error) {
    throw error;
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;
    if (decoded.type !== 'refresh') throw new Error('Token inválido');
    return decoded;
  } catch (error) {
    throw error;
  }
};

export const generateToken = generateAccessToken;
export const verifyToken = verifyAccessToken;