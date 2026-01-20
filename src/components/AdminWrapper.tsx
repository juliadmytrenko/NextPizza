'use server';
import { auth } from '@/auth';
import React from 'react';
import { redirect } from 'next/navigation';

const AdminWrapper: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const session = await auth();
  console.log('Session:', session); // Debugging session data

  if (!session || session.user?.name !== 'admin') {
    console.log('Redirecting to /sign-in'); // Debugging redirect
    redirect('/sign-in');
  }

  return <div>{children}</div>;
};

export default AdminWrapper;
