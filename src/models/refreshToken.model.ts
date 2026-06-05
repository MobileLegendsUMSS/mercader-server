import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
  id_usuario: Types.ObjectId;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
  revokedReason?: string | null;
  revokedAt?: Date | null;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    id_usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    revokedReason: {
      type: String,
      default: null
    },
    revokedAt: {
      type: Date,
      default: null
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "refresh_tokens",
  }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);