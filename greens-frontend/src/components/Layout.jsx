import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Header />
      <main style={{ padding: '0' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;