import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export function MatchingEngineLoader() {
  const [lineIndex, setLineIndex] = useState(0);

  const lines = [
    "> INITIALIZING RAREMATCH MULTI-AGENT ORCHESTRATOR...",
    "> WAKING RETRIEVAL AGENT...",
    "> CONNECTING TO CLINICALTRIALS.GOV API...",
    "> DOWNLOADING LIVE INCLUSION/EXCLUSION CRITERIA...",
    "> WAKING MATCHING AGENT...",
    "> RUNNING HEURISTIC PATIENT SCORING ENGINE...",
    "> WAKING EXPLAINABILITY AGENT (GEMINI 2.0)...",
    "> GENERATING AI MATCH EXPLANATION..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex(prev => (prev < lines.length - 1 ? prev + 1 : prev));
    }, 800); // New line every 800ms
    return () => clearInterval(interval);
  }, [lines.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem' }}>
      
      <div style={{ 
        width: '100%', 
        maxWidth: '700px',
        background: '#0a0a0a', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(0, 240, 255, 0.05)'
      }}>
        {/* Terminal Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          background: 'rgba(255,255,255,0.03)', 
          padding: '0.75rem 1rem', 
          borderBottom: '1px solid rgba(255,255,255,0.05)' 
        }}>
          <Terminal size={16} color="var(--text-secondary)" />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>SYSTEM_LOG_OUTPUT</span>
        </div>

        {/* Terminal Body */}
        <div style={{ 
          padding: '1.5rem', 
          fontFamily: 'var(--font-mono)', 
          fontSize: '0.875rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem',
          minHeight: '280px'
        }}>
          {lines.slice(0, lineIndex + 1).map((line, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ 
                color: index === lineIndex ? 'var(--accent-teal)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {line}
              {index === lineIndex && (
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  style={{ display: 'inline-block', width: '8px', height: '14px', background: 'var(--accent-teal)' }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
