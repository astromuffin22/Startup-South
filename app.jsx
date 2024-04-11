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


// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Main} />
          {/* Add routes for other pages */}
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}



// Idead for adding styling to the HMTL aspect
// export default App;
// Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const headerStyle = {
  // Add your CSS styles here
};

function Header() {
  return (
    <header style={headerStyle}>
      {/* Header content */}
    </header>
  );
}

// export default Header;
