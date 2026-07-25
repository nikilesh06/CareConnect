import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Shield, Clock, Calendar, FileText, Activity, Users, 
  ArrowRight, Heart, Award, Eye, Settings, HelpCircle, CheckCircle2 
} from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out', paddingBottom: '60px' }}>
      
      {/* 1. HERO SECTION */}
      <div className="text-center" style={{ padding: '80px 0 60px' }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px', 
          backgroundColor: 'rgba(79, 70, 229, 0.08)', padding: '6px 16px', 
          borderRadius: '30px', color: 'var(--primary)', fontWeight: '700', 
          fontSize: '0.85rem', marginBottom: '24px', textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>
          <Activity size={14} /> CareConnect Platform Active
        </div>
        <h1 style={{ fontSize: '3.6rem', marginBottom: '1.5rem', lineHeight: '1.1', color: 'var(--text-main)', fontWeight: '800' }}>
          Your Health, <br />
          <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #4338CA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Our Utmost Priority
          </span>
        </h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '640px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
          Instantly connect and schedule consultations with certified medical specialists. Manage prescriptions, track appointments, and secure your health journey today.
        </p>
        <div className="flex justify-center gap-4" style={{ marginBottom: '60px' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '14px' }}>
              Go to Dashboard <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '14px' }}>
                Get Started Free <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '14px' }}>
                Access Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 2. PLATFORM STATISTICS BAR */}
      <div style={{ marginBottom: '80px' }}>
        <div className="grid grid-cols-4">
          <div className="card text-center" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '4px' }}>500+</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certified Doctors</p>
          </div>
          <div className="card text-center" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--secondary)', marginBottom: '4px' }}>25k+</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Happy Patients</p>
          </div>
          <div className="card text-center" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#F59E0B', marginBottom: '4px' }}>99.8%</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Care Accuracy</p>
          </div>
          <div className="card text-center" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#EF4444', marginBottom: '4px' }}>24/7</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Automated Reminders</p>
          </div>
        </div>
      </div>

      {/* 3. CORE SERVICE VALUES */}
      <div style={{ padding: '60px 0', borderTop: '1px solid var(--border)', marginBottom: '60px' }}>
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Platform Core Features</h2>
          <p className="text-muted" style={{ maxWidth: '500px', margin: '8px auto 0' }}>Everything you need for clean, transparent, and structured healthcare management.</p>
        </div>
        <div className="grid grid-cols-3">
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' 
            }}>
              <Calendar size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Intelligent Slot Booking</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Select symptoms to automatically identify matching medical specialists and book instantly without double-bookings.
            </p>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--secondary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' 
            }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Automated Reminders</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Receive precise database-backed alerts at 1-day, 1-hour, and 15-minute intervals prior to session start times.
            </p>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' 
            }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Strict Safety Rules</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Benefit from the rigid 24-hour limit guardrails to handle fair slot-releasing cancellations and auto-rescheduling.
            </p>
          </div>
        </div>
      </div>

      {/* 4. HOW IT WORKS SECTION */}
      <div style={{ padding: '60px 0', borderTop: '1px solid var(--border)', marginBottom: '60px' }}>
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>How CareConnect Works</h2>
          <p className="text-muted" style={{ maxWidth: '500px', margin: '8px auto 0' }}>Consult top medical professionals in 3 simple, guided steps.</p>
        </div>
        <div className="grid grid-cols-3" style={{ gap: '40px' }}>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ 
              width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary)', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '1.25rem', fontWeight: '700', margin: '0 auto 20px', boxShadow: '0 4px 10px rgba(79,70,229,0.3)' 
            }}>
              1
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Filter by Symptoms</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', padding: '0 10px' }}>
              Choose your exact symptoms from the dashboard deck to instantly match with relevant specialties.
            </p>
          </div>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ 
              width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--secondary)', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '1.25rem', fontWeight: '700', margin: '0 auto 20px', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' 
            }}>
              2
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Select Availability</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', padding: '0 10px' }}>
              Pick a convenient calendar slot and complete your booking, enjoying transparent fee summaries.
            </p>
          </div>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ 
              width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#F59E0B', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '1.25rem', fontWeight: '700', margin: '0 auto 20px', boxShadow: '0 4px 10px rgba(245,158,11,0.3)' 
            }}>
              3
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Access Prescription</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', padding: '0 10px' }}>
              Join the consultation, receive automatic notifications, and access your diagnosis prescriptions instantly.
            </p>
          </div>
        </div>
      </div>

      {/* 5. DETAILED MEDICAL FAQs */}
      <div style={{ padding: '60px 0', borderTop: '1px solid var(--border)', marginBottom: '40px' }}>
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Frequently Asked Questions</h2>
          <p className="text-muted" style={{ maxWidth: '500px', margin: '8px auto 0' }}>Clear and direct explanations on platform guidelines and operations.</p>
        </div>
        <div className="grid grid-cols-2" style={{ gap: '30px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <HelpCircle size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
              Can I cancel or reschedule my appointment?
            </h3>
            <p className="text-muted" style={{ fontSize: '0.88rem', paddingLeft: '26px' }}>
              Yes, you can cancel or reschedule freely up to **24 hours prior** to the consultation. To protect doctor schedules, bookings are strictly locked within the final 24 hours.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <HelpCircle size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
              How are total consultation fees calculated?
            </h3>
            <p className="text-muted" style={{ fontSize: '0.88rem', paddingLeft: '26px' }}>
              The total cost includes the **doctor's baseline fee** plus a small **administrative commission percentage** configured by the platform administrator. The invoice breakdown is visible before booking.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <HelpCircle size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
              What is next-slot rescheduling?
            </h3>
            <p className="text-muted" style={{ fontSize: '0.88rem', paddingLeft: '26px' }}>
              If you request a reschedule, the platform automatically scans the doctor's calendar and moves your session to their **earliest chronologically available free future slot**, keeping the process effortless.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <HelpCircle size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
              How do background cron alerts work?
            </h3>
            <p className="text-muted" style={{ fontSize: '0.88rem', paddingLeft: '26px' }}>
              An automated background worker executes every minute to evaluate scheduled appointments, sending immediate alerts to the header dropdown exactly **1 day, 1 hour, and 15 minutes** beforehand.
            </p>
          </div>
        </div>
      </div>

      {/* 6. CALL TO ACTION (CTA) BANNER */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, #312E81 100%)', 
        borderRadius: 'var(--radius-lg)', padding: '50px', color: 'white', 
        textAlign: 'center', boxShadow: 'var(--shadow-xl)', position: 'relative', overflow: 'hidden' 
      }}>
        {/* Glow effect */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <h2 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px' }}>Ready to Experience CareConnect?</h2>
        <p style={{ color: '#E2E8F0', fontSize: '1.1rem', maxWidth: '580px', margin: '0 auto 30px', lineHeight: '1.5' }}>
          Create your account today as a patient or apply as a medical practitioner to elevate your professional practice.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link to="/register" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '12px 28px', fontSize: '1rem', fontWeight: '700', borderRadius: '12px' }}>
            Register Now
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '12px 28px', fontSize: '1rem', borderRadius: '12px' }}>
            Sign In
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Home;
