import { AppHeader } from '@/components/app-header';
import { AuthProvider } from '@/hooks/use-auth';

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="relative flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </div>
    </AuthProvider>
  );
}
