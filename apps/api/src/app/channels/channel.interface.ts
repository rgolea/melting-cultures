import { Document } from 'mongoose';
export const ChannelCollection = 'Channel';

export interface Channel extends Document {
  name: string;
  description: string;
  entityId: string;
}
