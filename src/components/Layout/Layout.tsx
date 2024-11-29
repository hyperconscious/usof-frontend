import React from 'react';
import Header from './Header';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-grow">{children}</main>
      <footer className="text-blue-800 py-4 text-center">
        <span>© 2069 Limited</span>
      </footer>
    </div>
  );
}

export default Layout;
