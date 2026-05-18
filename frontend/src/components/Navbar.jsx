import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Stethoscope, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <Stethoscope size={28} />
          <span>CareConnect</span>
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link flex items-center gap-2">
                <User size={18} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2" style={{ padding: '6px 12px' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
