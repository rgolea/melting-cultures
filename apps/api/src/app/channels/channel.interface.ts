import { Document } from 'mongoose';
export const ChannelCollection = 'Channel';

export interface ChannelInterface extends Document {
  name: string;
  description: string;
  entityId: string;
}
