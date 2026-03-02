/**
 * App.jsx
 *
 * Root component. Defines the application routes and switches
 * the background style based on the current page.
 *
 * Routes:
 *   / → Login
 *   /home → Home (dashboard)
 */

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';

// Applies the correct background class based on the current route
function App() {
  const location = useLocation();
  const isHome = location.pathname === '/home';

  return (
    <div className={`App ${isHome ? 'home-background' : 'login-background'}`}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

// Wraps App inside BrowserRouter to provide routing context
function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Root;