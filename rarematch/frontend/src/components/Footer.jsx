import React from 'react';
import { MessageSquare, Briefcase, Code, Activity } from 'lucide-react';
import '../index.css';

export function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-light)',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="content-wrapper">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              <Activity size={20} strokeWidth={2.5} />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>
                RareMatch
              </h2>
            </div>
            <p className="text-muted" style={{ fontSize: '0.875rem', lineHeight: '1.6', maxWidth: '300px' }}>
              Accelerating clinical trial matching for rare diseases using specialized AI agents and semantic phenotyping.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '1.25rem', fontWeight: 500 }}>PRODUCT</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="#" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Platform Features</a>
              <a href="#" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Research API</a>
              <a href="#" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Security & HIPAA</a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '1.25rem', fontWeight: 500 }}>COMPANY</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="#" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>About Us</a>
              <a href="#" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Careers</a>
              <a href="#" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Contact</a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '1.25rem', fontWeight: 500 }}>CONNECT</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" className="text-muted" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}><MessageSquare size={18} /></a>
              <a href="#" className="text-muted" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}><Briefcase size={18} /></a>
              <a href="#" className="text-muted" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}><Code size={18} /></a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>
            © 2026 RareMatch. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.75rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Privacy Policy</a>
            <a href="#" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.75rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
