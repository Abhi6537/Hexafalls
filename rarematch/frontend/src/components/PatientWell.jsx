import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import '../index.css';

export function PatientWell({ profile, note, entities, currentStep, onRunNER, onMatch, loadingState }) {
  if (!profile) return null;

  return (
    <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 2rem)', margin: '1rem 0', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>CASE ID: {profile.patient_id}</span>
          <h2 style={{ fontSize: '1.5rem', margin: '8px 0 0 0', fontWeight: 600 }}>Patient Twin Profile</h2>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '0.5rem' }}>
        {/* Age / Gender Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="premium-panel">
            <span className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500 }}>AGE</span>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: '4px 0 0 0' }}>{profile.age} <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 400 }}>yo</span></p>
          </div>
          <div className="premium-panel">
            <span className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500 }}>GENDER</span>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: '4px 0 0 0' }}>{profile.sex}</p>
          </div>
        </div>

        {/* Labs */}
        <div className="premium-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500 }}>BIOMARKERS</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem' }}>eGFR Kidney Lab</span>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>{profile.labs.eGFR} <span className="text-muted" style={{ fontSize: '0.75rem' }}>mL/min</span></span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem' }}>ERT Duration</span>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>{profile.ert_duration_months} <span className="text-muted" style={{ fontSize: '0.75rem' }}>months</span></span>
          </div>
        </div>

        {/* Phenotypes */}
        <div>
          <span className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500, display: 'block', marginBottom: '0.75rem' }}>PHENOTYPE CLUSTERS</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {profile.phenotypes.map((pheno, idx) => (
              <span key={idx} className="premium-badge">
                {pheno}
              </span>
            ))}
          </div>
        </div>

        {/* Narrative Note */}
        {note && (
          <div>
            <span className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500, display: 'block', marginBottom: '0.75rem' }}>CLINICIAN NARRATIVE</span>
            <div className="premium-panel">
              <p className="text-muted" style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>{note}</p>
            </div>
            
            {/* Step 2 Trigger */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button onClick={onRunNER} disabled={loadingState.ner} className="premium-btn premium-btn-primary" style={{ padding: '0.75rem 1.5rem', width: '100%' }}>
                  <Play size={16} /> {loadingState.ner ? 'Analyzing text...' : '2. Extract Semantic Entities (BioBERT)'}
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* NER */}
        {entities && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <span className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500, display: 'block', marginBottom: '0.75rem' }}>EXTRACTED ENTITIES (BioBERT)</span>
            <div className="premium-panel">
              <pre className="text-muted" style={{ fontSize: '0.75rem', margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>
                {JSON.stringify(entities, null, 2)}
              </pre>
            </div>

            {/* Step 3 Trigger */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button onClick={onMatch} disabled={loadingState.match} className="premium-btn premium-btn-primary" style={{ padding: '0.75rem 1.5rem', width: '100%', backgroundColor: '#0070f3' }}>
                  <Play size={16} /> {loadingState.match ? 'Querying Vector Database...' : '3. Match to Trial Protocols'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
