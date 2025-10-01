export type UserRole = 'student' | 'lecturer' | 'admin';

export type User = {
  id: string; // Mongoose will add this as `_id`, but we'll transform it to `id`
  name: string;
  email: string;
  role: UserRole;
  createdAt: string; // Will be a Date object from Mongoose
  password?: string;
};
