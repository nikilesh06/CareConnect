import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'user', phone: '', specialization: '', experience: '', fee: ''
  });
  const [file, setFile] = useState(null);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (file) data.append('certificate', file);
      
      await register(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '40px auto', animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
      <div className="card" style={{ padding: '40px 32px', position: 'relative', overflow: 'hidden' }}>
        {/* Colorful top border strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)' }} />
        
        <div className="text-center" style={{ marginBottom: '28px' }}>
          <div style={{ 
            width: '56px', height: '56px', borderRadius: '50%', 
            backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--secondary)', 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' 
          }}>
            <Heart size={28} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>Create Account</h2>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Join CareConnect to manage bookings instantly.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Register As</label>
            <select 
              name="role" 
              className="form-control" 
              value={formData.role} 
              onChange={handleChange}
              style={{ fontWeight: '600' }}
            >
              <option value="user">Patient (Search & book slots)</option>
              <option value="doctor">Medical Practitioner (Doctor)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-control" placeholder="e.g. Dr. John Doe" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" placeholder="Choose a strong password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="text" name="phone" className="form-control" placeholder="e.g. 555-0100" value={formData.phone} onChange={handleChange} />
          </div>

          {formData.role === 'doctor' && (
            <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', color: 'var(--primary)' }}>Doctor Professional Profile Details</h4>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input type="text" name="specialization" className="form-control" placeholder="e.g. Cardiologist, Neurologist" value={formData.specialization} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input type="number" name="experience" className="form-control" placeholder="e.g. 10" value={formData.experience} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Fee (₹)</label>
                <input type="number" name="fee" className="form-control" placeholder="e.g. 120" value={formData.fee} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Upload Professional Certificate</label>
                <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ padding: '12px', fontSize: '0.95rem', marginTop: '8px' }}>
            {loading ? 'Processing Registration...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 text-muted" style={{ fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
