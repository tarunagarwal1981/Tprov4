'use client';

import React, { useState } from 'react';
import { useImprovedAuth } from '@/context/ImprovedAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SigninTest() {
  const { state, signIn, signOut, clearError } = useImprovedAuth();
  const [testEmail] = useState('test@example.com');
  const [testPassword] = useState('testpassword123');

  const handleTestSignin = async () => {
    try {
      clearError();
      const result = await signIn(testEmail, testPassword);
      console.log('Test signin result:', result);
    } catch (error) {
      console.error('Test signin error:', error);
    }
  };

  const handleTestSignout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Test signout error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">Signin Test Component</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Auth State:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span>Loading:</span>
              <Badge variant={state.isLoading ? 'destructive' : 'secondary'}>
                {state.isLoading ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Authenticated:</span>
              <Badge variant={state.isAuthenticated ? 'default' : 'secondary'}>
                {state.isAuthenticated ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Initialized:</span>
              <Badge variant={state.isInitialized ? 'default' : 'secondary'}>
                {state.isInitialized ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>User:</span>
              <Badge variant={state.user ? 'default' : 'secondary'}>
                {state.user ? state.user.email : 'None'}
              </Badge>
            </div>
            {state.error && (
              <div className="flex items-center gap-2">
                <span>Error:</span>
                <Badge variant="destructive">{state.error}</Badge>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleTestSignin}
            disabled={state.isLoading || state.isAuthenticated}
            className="w-full"
          >
            Test Sign In
          </Button>
          <Button 
            onClick={handleTestSignout}
            disabled={state.isLoading || !state.isAuthenticated}
            variant="outline"
            className="w-full"
          >
            Test Sign Out
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p>This component helps debug signin issues by showing the current auth state and providing test buttons.</p>
        </div>
      </CardContent>
    </Card>
  );
}
