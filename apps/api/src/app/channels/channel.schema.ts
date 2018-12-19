import * as mongoose from "mongoose";
import { ChannelCollection } from "./channel.interface";

export const ChannelSchema = new mongoose.Schema({
  name: String,
  description: String,
  ofType: {
    type: String,
    default: ChannelCollection
  },
}, {
  autoIndex: true,
  validateBeforeSave: true,
  timestamps: true,
});
