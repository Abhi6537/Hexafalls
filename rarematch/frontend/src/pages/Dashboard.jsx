import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataUploader } from '../components/DataUploader';
import { BentoDashboard } from '../components/BentoDashboard';
import { MatchingEngineLoader } from '../components/MatchingEngineLoader';

export function Dashboard() {
  const [state, setState] = useState({
    patient_profile: null,
    patient_note: null,
    extracted_entities: null,
    match_results: null
  });

  const [loading, setLoading] = useState({ match: false });
  
  // Wizard Steps: 1 = Upload, 2 = Results
  const [workflowStep, setWorkflowStep] = useState(1);

  // Load existing state if applicable
  useEffect(() => {
    fetch('/api/state')
      .then(res => res.json())
      .then(data => {
        setState(data);
        // If state already has match results, jump straight to results
        if (data.match_results && data.match_results.length > 0) {
            setWorkflowStep(2);
        }
      })
      .catch(err => console.error("Error fetching state:", err));
  }, []);

  const handlePatientSelect = (patient) => {
    fetch(`/api/patients/${patient.patient_id}/reports`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setState({
            patient_profile: {
              patient_id: patient.patient_id,
              age: patient.age,
              sex: patient.sex,
              phenotypes: patient.phenotypes
            },
            patient_note: "Historical Note loaded from cloud.",
            extracted_entities: null,
            match_results: data.reports
          });
          setWorkflowStep(2); // Jump to Results
        }
      })
      .catch(err => console.error("Error loading patient reports:", err));
  };


  // Called when user finishes Upload step
  const handleProceedToMatch = () => {
    // In a real flow, the upload component sets the `patient_profile`.
    // Since our backend generates it via `/api/generate-twin`, we will trigger 
    // the generation and match silently here for the demo flow.
    setLoading({ match: true });
    
    // 1. Generate Twin (Mocking the Upload data ingestion)
    fetch('/api/generate-twin', { method: 'POST' })
      .then(res => res.json())
      .then(genData => {
        return fetch('/api/match-trials', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ persona: 'doctor' })
        });
      })
      .then(res => res.json())
      .then(data => {
        setState(data.state);
        setLoading({ match: false });
        setWorkflowStep(2); // Move to Results Dashboard
        
        // Auto-save to Supabase
        if (data.state.match_results && data.state.match_results.length > 0) {
            fetch('/api/save-patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_id: data.state.patient_profile.patient_id,
                    age: data.state.patient_profile.age,
                    sex: data.state.patient_profile.sex,
                    phenotypes: data.state.patient_profile.phenotypes,
                    reports: data.state.match_results
                })
            }).catch(err => console.error("Error auto-saving:", err));
        }
      })
      .catch(err => {
        console.error("Error running matching pipeline:", err);
        setLoading({ match: false });
      });
  };

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', position: 'relative' }}>
      
      <div style={{ width: '100%', height: '100%' }}>
        
        <AnimatePresence mode="wait">
          

          {workflowStep === 1 && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {loading.match ? (
                 <MatchingEngineLoader />
              ) : (
                <DataUploader onProceed={handleProceedToMatch} />
              )}
            </motion.div>
          )}

          {workflowStep === 2 && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BentoDashboard matchState={state} persona="doctor" />
            </motion.div>
          )}

        </AnimatePresence>
        
      </div>

      <div className="glow-effect" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.3, width: '120vw', height: '120vh', zIndex: -1, pointerEvents: 'none' }} />
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
