import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
      <div className="card" style={{ padding: '40px 32px', position: 'relative', overflow: 'hidden' }}>
        {/* Colorful top border strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)' }} />
        
        <div className="text-center" style={{ marginBottom: '28px' }}>
          <div style={{ 
            width: '56px', height: '56px', borderRadius: '50%', 
            backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)', 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' 
          }}>
            <Stethoscope size={28} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>Welcome Back</h2>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Enter credentials to access your care dashboard.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="name@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ padding: '12px', fontSize: '0.95rem' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-4 text-muted" style={{ fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
