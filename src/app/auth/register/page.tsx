import { Suspense } from 'react';
import { SimpleRegisterForm } from '@/components/auth/SimpleRegisterForm';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SimpleRegisterForm />
    </Suspense>
  );
}
