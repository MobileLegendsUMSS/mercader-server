import { Types } from 'mongoose';

export const getValidObjectId = (id: string | string[] | undefined): string | null => {
  if (!id) return null;
  const idString = Array.isArray(id) ? id[0] : id;
  return Types.ObjectId.isValid(idString) ? idString : null;
};