import * as dotenv from 'dotenv';

dotenv.config();

function verifyEnvVariable(envVar: string, envValue: string | undefined) {
  const value = process.env[envVar] || envValue;
  if (!value) {
    throw new Error(`Falta la variable de entorno ${envVar}.`);
  }
  return value;
}

export const env = {
  NODE_ENV: verifyEnvVariable("NODE_ENV", "development"),
  PORT: verifyEnvVariable("PORT", "3000"),
  DB_USER: verifyEnvVariable("DB_USER", "mongodb"),
  DB_PASSWORD: verifyEnvVariable("DB_PASSWORD", undefined),
  DB_URL: verifyEnvVariable("DB_URL", undefined),
  JWT_SECRET: verifyEnvVariable("JWT_SECRET", undefined),
  CLOUDINARY_CLOUD_NAME: verifyEnvVariable("CLOUDINARY_CLOUD_NAME", undefined),
  CLOUDINARY_API_KEY: verifyEnvVariable("CLOUDINARY_API_KEY", undefined),
  CLOUDINARY_API_SECRET: verifyEnvVariable("CLOUDINARY_API_SECRET", undefined),
  SEND_EMAIL_HOST: verifyEnvVariable("SEND_EMAIL_HOST", undefined),
  SEND_USER: verifyEnvVariable("SEND_USER", undefined),
  SEND_EMAIL_USER: verifyEnvVariable("SEND_EMAIL_USER", "no-reply"),
  SEND_EMAIL_PASSWORD: verifyEnvVariable("SEND_EMAIL_PASSWORD", undefined),
  RESEND_API_KEY: verifyEnvVariable("RESEND_API_KEY", undefined)
};