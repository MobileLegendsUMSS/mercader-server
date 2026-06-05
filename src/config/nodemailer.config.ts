import { env } from "../config/env.config";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const transporter = nodemailer.createTransport({
  host: env.SEND_EMAIL_HOST,
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: env.SEND_EMAIL_USER,
    pass: env.SEND_EMAIL_PASSWORD
  }
} as SMTPTransport.Options);