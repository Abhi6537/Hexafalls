import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { PatientWell } from '../components/PatientWell';
import { MatchGrid } from '../components/MatchGrid';

export function Dashboard() {
  const [state, setState] = useState({
    patient_profile: null,
    patient_note: '',
    extracted_entities: null,
    match_results: null
  });

  const [loading, setLoading] = useState({
    generate: false,
    ner: false,
    match: false
  });

  // Track the current step in the pipeline
  // 0: Empty, 1: Patient Generated, 2: NER Completed, 3: Match Completed
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetch('/api/state')
      .then(res => res.json())
      .then(data => {
        setState(data);
        if (data.match_results) setCurrentStep(3);
        else if (data.extracted_entities) setCurrentStep(2);
        else if (data.patient_profile) setCurrentStep(1);
      })
      .catch(err => console.error("Error fetching state:", err));
  }, []);

  const handleGenerate = () => {
    setLoading(prev => ({ ...prev, generate: true }));
    fetch('/api/generate-twin', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setState(data.state);
        setLoading(prev => ({ ...prev, generate: false }));
        setCurrentStep(1);
      })
      .catch(err => {
        console.error("Error generating twin:", err);
        setLoading(prev => ({ ...prev, generate: false }));
      });
  };

  const handleRunNER = () => {
    if (!state.patient_note) return;
    setLoading(prev => ({ ...prev, ner: true }));
    fetch('/api/run-ner', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setState(data.state);
        setLoading(prev => ({ ...prev, ner: false }));
        setCurrentStep(2);
      })
      .catch(err => {
        console.error("Error running NER:", err);
        setLoading(prev => ({ ...prev, ner: false }));
      });
  };

  const handleMatch = () => {
    if (!state.patient_profile) return;
    setLoading(prev => ({ ...prev, match: true }));
    fetch('/api/match-trials', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setState(data.state);
        setLoading(prev => ({ ...prev, match: false }));
        setCurrentStep(3);
      })
      .catch(err => {
        console.error("Error running matching:", err);
        setLoading(prev => ({ ...prev, match: false }));
      });
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      
      <div style={{ flex: 1, display: 'flex', gap: '1rem', position: 'relative' }}>
        
        {/* Step 0: Empty State Pipeline Trigger */}
        <AnimatePresence>
          {currentStep === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            >
              <div className="premium-panel" style={{ textAlign: 'center', maxWidth: '400px', padding: '3rem 2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Start Analysis Pipeline</h2>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>Initiate the agentic workflow to generate a synthetic clinical case and match against trial protocols.</p>
                <button 
                  onClick={handleGenerate}
                  disabled={loading.generate}
                  className="premium-btn premium-btn-primary" 
                  style={{ padding: '0.875rem 2rem', fontSize: '1rem', width: '100%' }}
                >
                  {loading.generate ? 'Generating Patient Twin...' : '1. Generate Patient Twin'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1 & 2: Patient Profile & NER */}
        <AnimatePresence>
          {currentStep >= 1 && (
            <motion.div 
              layout
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0, flex: currentStep === 3 ? 1 : 2 }} // Shrink when match grid opens
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', height: '100%' }}
            >
              <PatientWell 
                profile={state.patient_profile} 
                note={state.patient_note} 
                entities={state.extracted_entities} 
                currentStep={currentStep}
                onRunNER={handleRunNER}
                onMatch={handleMatch}
                loadingState={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Step 3: Match Reports Grid */}
        <AnimatePresence>
          {currentStep >= 3 && (
            <motion.div 
              layout
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0, flex: 1.5 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={{ display: 'flex', height: '100%' }}
            >
              <MatchGrid 
                matchResults={state.match_results} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="glow-effect" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.5, width: '120vw', height: '120vh' }} />
    </div>
  );
}
