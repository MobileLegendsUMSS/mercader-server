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
};