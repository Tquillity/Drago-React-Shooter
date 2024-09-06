import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <nav className="main-menu">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/leaderboard">All Time Leaderboard</Link>
        </li>
        <li>
          <Link to="/active-tournaments">Current Active Tournaments</Link>
        </li>
        <li>
          <Link to="/empty">Empty</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;