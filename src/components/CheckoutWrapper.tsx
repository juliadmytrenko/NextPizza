'use server';
import { auth } from '@/auth';
import React from 'react';
import { redirect } from 'next/navigation';

const CheckoutWrapper: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const session = await auth();
  if (!session) redirect('/sign-in');
  return <div>{children}</div>;
};

export default CheckoutWrapper;
