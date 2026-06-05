import { env } from "../config/env.config";
import * as Brevo from "@getbrevo/brevo";

export const brevo = new Brevo.BrevoClient({
  apiKey: env.BREVO_API_KEY
});
