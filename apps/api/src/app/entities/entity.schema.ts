import { Schema } from 'mongoose';
import { EntityCollection } from './entity.interface';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export const EntitySchema = new Schema(
  {
    name: {
      required: true,
      type: String
    },
    email: {
      required: true,
      type: String,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    location: {
      type: [Number], // [<longitude>, <latitude>]
      index: '2d' // create the geospatial index
    },
    ofType: {
      type: String,
      default: EntityCollection
    }
  },
  {
    autoIndex: true,
    validateBeforeSave: true,
    timestamps: true
  }
);

EntitySchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  const salt = genSaltSync(10);
  this['password'] = hashSync(this['password'], salt);
  next();
});

EntitySchema.methods.comparePassword = function(candidatePassword) {
  return compareSync(candidatePassword, this['password']);
};
