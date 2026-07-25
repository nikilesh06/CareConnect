import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Stethoscope, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <Stethoscope size={28} />
          <span>CareConnect</span>
        </Link>
        <div className="nav-links flex items-center gap-3">
          {user ? (
            <>
              <button onClick={handleDashboardClick} className="btn btn-secondary flex items-center gap-2" style={{ padding: '8px 16px', fontWeight: '600' }}>
                <User size={18} /> Dashboard
              </button>
              <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2" style={{ padding: '8px 14px' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : !isAuthPage ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
