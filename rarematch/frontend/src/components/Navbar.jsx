import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import '../index.css';

export function Navbar() {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-light)',
      padding: '1rem 0'
    }}>
      <div className="content-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)'
          }}>
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Know Your Trial
            </h1>
          </div>
        </Link>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#how-it-works" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.875rem', fontWeight: 400, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>How it Works</a>
          <a href="#features" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.875rem', fontWeight: 400, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Features</a>
          <a href="#case-studies" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.875rem', fontWeight: 400, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Case Studies</a>
          
          <Link to="/dashboard" className="premium-btn premium-btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none' }}>
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  );
}
