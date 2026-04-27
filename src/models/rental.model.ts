import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRental extends Document {
  game_id: Types.ObjectId;
  start_date: Date;
  return_date: Date;
  status: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const RentalSchema = new Schema<IRental>(
  {
    game_id: {
      type: Schema.Types.ObjectId,
      ref: 'Juego',
      required: [true, 'The game is required']
    },
    start_date: {
      type: Date,
      required: [true, 'The start date is required']
    },
    return_date: {
      type: Date,
      required: [true, 'The return date is required'],
      validate: {
        validator: function(this: any, value: Date) {
          return value >= this.start_date;
        },
        message: 'The return date must be greater than or equal to the start date'
      }
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active'
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'rental'
  }
);

export const Rental = mongoose.model<IRental>('Rental', RentalSchema);
