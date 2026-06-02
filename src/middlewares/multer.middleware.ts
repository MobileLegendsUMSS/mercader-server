import { Request, Response, NextFunction } from "express";
import { upload } from "../config/multer.config";
import multer from "multer";

function verifyMulter(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `Error de archivo (multer): ${(err as Error).message}`
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: `Error de archivo: ${(err as Error).message}`
    });
  }
  next();
}

export function checkPaymentProofImageErrors(req: Request, res: Response, next: NextFunction) {
  upload.single("comprobante")(req, res, (err) => {
    if (err) {
      return verifyMulter(err, req, res, next);
    }
    next();
  });
}