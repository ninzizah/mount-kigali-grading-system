import mongoose, { Schema, Document, models, Model } from 'mongoose';
import type { User as UserType } from '../types';

// Extend the UserType to include Mongoose's _id
export interface UserDocument extends Omit<UserType, 'id' | 'createdAt'>, Document {
  createdAt: Date;
}

const UserSchema: Schema<UserDocument> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'lecturer'], // Admin is not stored in DB
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose adds an `_id` field by default. We can create a virtual `id` field to match our UserType.
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are included in JSON output
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id; // remove _id
    delete ret.__v; // remove __v
  },
});
UserSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

// Prevent Mongoose from compiling the model multiple times in Next.js hot-reload environments
const User: Model<UserDocument> =
  models.User || mongoose.model<UserDocument>('User', UserSchema);

export default User;
