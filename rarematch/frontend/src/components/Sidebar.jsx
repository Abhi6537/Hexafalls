import React from 'react';
import '../index.css';
import { Activity, Beaker, Zap, FileText } from 'lucide-react';

export function Sidebar({ onGenerate, onRunNER, onMatch, loadingState }) {
  return (
    <aside className="premium-card" style={{ width: '280px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 2rem)', margin: '1rem', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
        <Activity size={20} strokeWidth={2.5} />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>RareMatch</h1>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="premium-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}>
          <Activity size={18} />
          <span style={{ fontSize: '0.875rem' }}>Dashboard</span>
        </div>
        <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
          <FileText size={18} />
          <span style={{ fontSize: '0.875rem' }}>Patient Records</span>
        </div>
        <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
          <Beaker size={18} />
          <span style={{ fontSize: '0.875rem' }}>Active Trials</span>
        </div>
      </nav>

    </aside>
  );
}
