import { UserManagement } from '@/components/admin/user-management';
import { getUsers } from '@/lib/data';

export default async function AdminDashboardPage() {
  const users = await getUsers();
  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          User Management
        </h1>
        <p className="text-muted-foreground">
          View, create, update, and delete user accounts.
        </p>
      </div>
      <UserManagement initialUsers={users} />
    </div>
  );
}
