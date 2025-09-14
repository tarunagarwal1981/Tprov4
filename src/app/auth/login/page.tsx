import { Suspense } from 'react';
import { SimpleLoginForm } from '@/components/auth/SimpleLoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SimpleLoginForm />
    </Suspense>
  );
}
