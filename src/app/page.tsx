import { LoginForm } from '@/components/auth/login-form';
import { KigaliGradeAiLogo } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <main className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <KigaliGradeAiLogo className="h-16 w-16 text-primary" />
          <h1 className="mt-4 text-4xl font-headline font-bold text-foreground">
            Mount Kigali Grading System
          </h1>
          <p className="mt-2 text-muted-foreground">
            AI-Powered Grading and Study Assistance
          </p>
        </div>
        <LoginForm />
      </main>
    </div>
  );
}
