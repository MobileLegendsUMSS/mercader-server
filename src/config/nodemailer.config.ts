import { env } from "../config/env.config";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: env.SEND_EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: env.SEND_EMAIL_USER,
    pass: env.SEND_EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  socketTimeout: 10000,
  connectionTimeout: 10000
});