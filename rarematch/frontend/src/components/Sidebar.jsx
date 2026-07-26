import React, { useState, useEffect } from 'react';
import '../index.css';
import { Activity, Beaker, Zap, FileText, User } from 'lucide-react';

export function Sidebar({ onPatientSelect }) {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setPatients(data.data || []);
        }
      })
      .catch(err => console.error("Error fetching patients:", err));
  }, []);

  return (
    <aside className="premium-card" style={{ width: '280px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 2rem)', margin: '1rem', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
        <Activity size={20} strokeWidth={2.5} />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>RareMatch</h1>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
        <div className="premium-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }} onClick={() => window.location.reload()}>
          <Activity size={18} />
          <span style={{ fontSize: '0.875rem' }}>Dashboard</span>
        </div>
        
        <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          <FileText size={18} />
          <span style={{ fontSize: '0.875rem' }}>Patient Records</span>
        </div>
        
        {/* Render Saved Patients */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '2rem' }}>
          {patients.map(patient => (
            <div 
              key={patient.id}
              onClick={() => onPatientSelect(patient)}
              style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s', fontSize: '0.8rem', borderRadius: '6px' }} 
              onMouseOver={e => { e.currentTarget.style.color='var(--text-primary)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; }} 
              onMouseOut={e => { e.currentTarget.style.color='var(--text-secondary)'; e.currentTarget.style.background='transparent'; }}
            >
              <User size={14} />
              {patient.patient_id} ({patient.age}{patient.sex})
            </div>
          ))}
        </div>

        <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s', marginTop: '1rem' }} onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
          <Beaker size={18} />
          <span style={{ fontSize: '0.875rem' }}>Active Trials</span>
        </div>
      </nav>

    </aside>
  );
}
