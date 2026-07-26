import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, FileText, Loader, BrainCircuit, Activity, Database, Search, CheckCircle2, Circle } from 'lucide-react';

export function DataUploader({ onProceed }) {
  const [activeTab, setActiveTab] = useState('pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [apiData, setApiData] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const steps = [
    "Booting local NLP model (d4data/biomedical-ner-all)...",
    "Extracting semantic phenotypes from text...",
    "Querying EBI OLS Orphanet Database (Europe)...",
    "Verifying official disease terminology...",
    "Structuring final JSON Patient Profile..."
  ];

  useEffect(() => {
    let interval;
    if (isProcessing) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length) {
             clearInterval(interval);
             return prev;
          }
          return prev + 1;
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isProcessing, steps.length]);

  useEffect(() => {
    if (currentStep >= steps.length && apiData) {
       setIsProcessing(false);
       setResult(apiData);
    }
  }, [currentStep, apiData, steps.length]);

  const handleRealUpload = async () => {
    if (activeTab === 'pdf' && !pdfFile) {
        alert("Please select a PDF file first.");
        return;
    }
    if (activeTab === 'text' && !textInput.trim()) {
        alert("Please paste some text first.");
        return;
    }

    setIsProcessing(true);
    setCurrentStep(0);
    setApiData(null);
    setResult(null);
    try {
      let response;
      if (activeTab === 'pdf') {
          const formData = new FormData();
          formData.append("file", pdfFile);
          
          response = await fetch('/api/upload-pdf', {
            method: 'POST',
            body: formData
          });
      } else {
          response = await fetch('/api/process-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textInput })
          });
      }
      
      const data = await response.json();
      if (data.status === 'success') {
        setApiData(data.state.patient_profile);
      } else {
        alert("Error: " + data.detail);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Error processing document:", err);
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
          setPdfFile(e.target.files[0]);
      }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '2rem' }}
    >
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Upload Patient Data</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Provide the clinical record to extract biomarkers.</p>
      </div>

      <div className="premium-panel" style={{ width: '600px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRadius: '16px' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <button 
            onClick={() => setActiveTab('pdf')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: activeTab === 'pdf' ? 'var(--accent-teal)' : 'var(--text-secondary)', fontWeight: activeTab === 'pdf' ? 600 : 400, cursor: 'pointer', padding: '0.5rem 1rem', borderBottom: activeTab === 'pdf' ? '2px solid var(--accent-teal)' : '2px solid transparent', marginBottom: '-1rem' }}
          >
            <FileUp size={18} /> PDF Upload
          </button>
          <button 
            onClick={() => setActiveTab('text')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: activeTab === 'text' ? 'var(--accent-teal)' : 'var(--text-secondary)', fontWeight: activeTab === 'text' ? 600 : 400, cursor: 'pointer', padding: '0.5rem 1rem', borderBottom: activeTab === 'text' ? '2px solid var(--accent-teal)' : '2px solid transparent', marginBottom: '-1rem' }}
          >
            <FileText size={18} /> Paste Text
          </button>
        </div>

        {/* Dynamic Area */}
        <AnimatePresence mode="wait">
          {!isProcessing && !result && activeTab === 'pdf' && (
            <motion.div key="pdf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '200px', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', position: 'relative' }}>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange} 
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              />
              <FileUp size={48} color={pdfFile ? "var(--accent-teal)" : "var(--text-secondary)"} />
              <span style={{ color: pdfFile ? "var(--accent-teal)" : "var(--text-secondary)" }}>
                  {pdfFile ? pdfFile.name : "Click to browse or drop your PDF here"}
              </span>
              {pdfFile && (
                  <button className="primary-button" onClick={handleRealUpload} style={{ zIndex: 10, marginTop: '1rem' }}>Analyze PDF</button>
              )}
            </motion.div>
          )}

          {!isProcessing && !result && activeTab === 'text' && (
            <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <textarea 
                placeholder="Paste clinical note here..." 
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                style={{ width: '100%', height: '150px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem', color: 'var(--text-primary)', resize: 'none', fontFamily: 'inherit' }}
              />
              <button className="primary-button" onClick={handleRealUpload} style={{ alignSelf: 'flex-end' }}>Analyze Text</button>
            </motion.div>
          )}

          {isProcessing && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                <BrainCircuit size={16} color="var(--text-secondary)" />
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>RareMatch AI Pipeline Execution</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep;
                  const isActive = index === currentStep;
                  const isPending = index > currentStep;

                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: isPending ? 0 : 1, x: isPending ? -10 : 0 }} 
                      transition={{ duration: 0.3 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                    >
                      {isCompleted && <CheckCircle2 size={16} color="#10b981" />}
                      {isActive && (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                          <Loader size={16} color="var(--accent-teal)" />
                        </motion.div>
                      )}
                      {isPending && <Circle size={16} color="rgba(255,255,255,0.1)" />}

                      <span style={{ 
                        color: isCompleted ? 'var(--text-primary)' : (isActive ? 'var(--accent-teal)' : 'rgba(255,255,255,0.2)'),
                        fontWeight: isActive ? 600 : 400
                      }}>
                        {step}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {result && !isProcessing && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* New Creative Structure */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                
                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-teal)' }}>
                    <Activity size={18} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>PRIMARY DIAGNOSIS</span>
                  </div>
                  <span style={{ fontSize: '1.125rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.5rem' }}>{result.disease}</span>
                  
                  {/* Orphanet Magnifying Glass */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                    <motion.div 
                      animate={{ x: [-2, 10, -2] }} 
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    >
                      <Search size={14} color="#10b981" />
                    </motion.div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Verified via <strong style={{ color: '#10b981' }}>EBI OLS Orphanet Database</strong></span>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b' }}>
                    <Database size={18} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>EXTRACTED DATA</span>
                  </div>
                  <span style={{ fontSize: '1.125rem', color: 'var(--text-primary)', fontWeight: 500 }}>{result.phenotypes?.length || 0} Clinical Phenotypes</span>
                </div>

              </div>

              <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Ready for Just-In-Time RAG retrieval.</span>
              </div>

              <button className="primary-button" onClick={onProceed} style={{ alignSelf: 'center', width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                Fetch Real-Time Trials from ClinicalTrials.gov
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
