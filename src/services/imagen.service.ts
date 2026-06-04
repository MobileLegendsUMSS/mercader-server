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

export async function uploadGameCoverImage(
  gameTitle: string,
  coverImageBuffer: Buffer,
  imageMimetype: string) {
  try {
    const result = await cloudinary.uploader.upload(
      `data:${imageMimetype};base64,${coverImageBuffer.toString("base64")}`,
      {
        folder: `juego_portadas`,
        public_id: `juego_${gameTitle}`
      }
    );
    return result.secure_url;
  } catch (err) {
    throw new Error(`Error al subir imagen: ${(err as Error).message}`);
  }
}

export async function updateGameCoverImage(
  gameTitle: string,
  coverImageBuffer: Buffer,
  imageMimetype: string) {
  try {
    const publicId = `juego_portadas/juego_${gameTitle}`;
    const result = await cloudinary.uploader.upload(
      `data:${imageMimetype};base64,${coverImageBuffer.toString("base64")}`,
      {
        public_id: publicId,
        overwrite: true,
        invalidate: true
      }
    );

    return result.secure_url;
  } catch (err) {
    throw new Error(`Error al actualizar imagen: ${(err as Error).message}`);
  }
}