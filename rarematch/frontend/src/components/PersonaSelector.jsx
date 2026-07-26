import React from 'react';
import { motion } from 'framer-motion';
import { User, Stethoscope, Microscope } from 'lucide-react';

export function PersonaSelector({ onSelect }) {
  const personas = [
    { id: 'patient', title: 'I am a Patient', icon: <User size={48} strokeWidth={1.5} />, desc: 'Find trials you qualify for and understand them easily.' },
    { id: 'doctor', title: 'I am a Doctor', icon: <Stethoscope size={48} strokeWidth={1.5} />, desc: 'Quickly screen patients against complex trial protocols.' },
    { id: 'researcher', title: 'I am a Researcher', icon: <Microscope size={48} strokeWidth={1.5} />, desc: 'Find ideal candidates for your clinical cohorts.' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '3rem' }}
    >
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>How will you use RareMatch today?</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Select your role to personalize the AI analysis.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {personas.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
            whileHover={{ scale: 1.05, y: -5, borderColor: 'var(--accent-teal)', boxShadow: '0 10px 40px rgba(0,240,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(p.id)}
            className="premium-panel"
            style={{ 
              width: '280px', 
              padding: '3rem 2rem', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '1.5rem', 
              cursor: 'pointer',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'border-color 0.3s, box-shadow 0.3s'
            }}
          >
            <div style={{ color: 'var(--accent-teal)' }}>{p.icon}</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{p.title}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
