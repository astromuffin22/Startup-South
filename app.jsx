// Figuring out types of formatting for my code


// Header.js
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <div className="title-logo">
        <p className="welcome">Welcome</p>
        <h1> Case Central </h1>
        <div id="picture" className="picture-box">
          <img width="100px" height="100px" src="Case Central-logos.jpeg" alt="random" />
        </div>
      </div>
      <nav>
        <h1>Welcome to Case Central!</h1>
        <menu>
          <Link to="/">Login</Link>
          <Link to="/mainscreen">MainPage</Link>
          <Link to="/instructions">Instructions</Link>
        </menu>
      </nav>
    </header>
  );
}

export default Header;


