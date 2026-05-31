import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <div className="flex h-screen overflow-hidden bg-moneta-navy-dark">
    <Sidebar />
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  </div>
);
