import { Document } from 'mongoose';
export const EntityCollection = 'Entity';

export interface Entity extends Document {
  name: string;
  email: string;
  password: string;
  location?: [number, number];
  readonly comparePassword?: (password: string) => Promise<boolean>;
}
