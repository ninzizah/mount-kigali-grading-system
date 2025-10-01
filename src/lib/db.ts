// TODO: This file is a template for your database connection.
// After exporting, you will need to:
// 1. Add your MongoDB connection string to your .env file (e.g., MONGODB_URI="your_connection_string").
// 2. Uncomment the code below.
// 3. Create a Mongoose model for your User schema in `src/lib/models/user.ts`.
// 4. Replace the mock logic in `src/lib/data.ts` with calls to this database service.

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

// Caching the database connection to avoid re-connections on every serverless function invocation.
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
