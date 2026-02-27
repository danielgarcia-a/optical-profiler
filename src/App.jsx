import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';

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

function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Root;
