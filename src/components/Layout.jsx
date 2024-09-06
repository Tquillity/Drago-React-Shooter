import React from 'react';
import Menu from './Menu';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Menu />
      <main>{children}</main>
    </div>
  );
};

export default Layout;