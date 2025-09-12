'use client';

import React from 'react';
import { withAuth } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { UserRole } from '@/lib/types';

interface OperatorLayoutProps {
  children: React.ReactNode;
}

function OperatorLayoutContent({ children }: OperatorLayoutProps) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}

// Wrap with role-based protection
const OperatorLayout = withAuth(OperatorLayoutContent, {
  requiredRoles: [UserRole.TOUR_OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]
});

export default OperatorLayout;
