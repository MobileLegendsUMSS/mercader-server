  import { env } from "./env.config";
  import { Resend } from "resend";

  export const resend = new Resend(env.RESEND_API_KEY);

/*
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
*/