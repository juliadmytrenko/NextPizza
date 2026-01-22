'use client';
import { useState, useEffect, Key } from 'react';

import { useMenu } from '@/context/MenuContext';
import { useOrders } from '@/context/OrdersContext';
import Link from 'next/link';
import OrdersList from '@/components/OrdersList';
import MenuManager from '@/components/MenuManager';

interface MenuItemSize {
  size: number;
  price: number;
}

export default function AdminPage() {
  const menuContext = useMenu();
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('orders');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Panel - Next Pizza</h1>
            <Link
              href="/"
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'orders'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'menu'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Menu Management
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'orders' ? (
            <OrdersList />
          ) : (
            <MenuManager MenuContext={menuContext} />
          )}
        </div>
      </div>
    </div>
  );
}
