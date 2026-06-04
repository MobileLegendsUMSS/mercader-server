import cloudinary from "../config/cloudinary.config";

export async function uploadPaymentProof(
  idUser: string,
  paymentProofBuffer: Buffer,
  imageMimetype: string) {
  try {
    const result = await cloudinary.uploader.upload(
      `data:${imageMimetype};base64,${paymentProofBuffer.toString("base64")}`,
      {
        folder: `comprobantes_pago/${idUser}`,
        public_id: `pago_${Date.now()}`
      }
    );
    return result.secure_url;
  } catch (err) {
    throw new Error(`Error al subir imagen: ${(err as Error).message}`);
  }
}