import { Suspense } from 'react';
import { ModernLoginForm } from '@/components/auth/ModernLoginForm';
import { SigninTest } from '@/components/debug/SigninTest';

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <ModernLoginForm />
      </Suspense>
      
      {/* Debug component - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <SigninTest />
        </div>
      )}
    </div>
  );
}
