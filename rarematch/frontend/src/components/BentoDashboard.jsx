import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Activity, User, Dna, Beaker, Heart, Droplet, X, Sparkles } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import ReactMarkdown from 'react-markdown';

export function BentoDashboard({ matchState, persona }) {
  const [showAiModal, setShowAiModal] = useState(false);
  const patient = matchState?.patient_profile;
  const matchResult = matchState?.match_results?.reports?.[0]?.match_report;
  const explanation = matchState?.match_results?.reports?.[0]?.explanation_md;

  if (!patient || !matchResult) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        <h2>No match results found.</h2>
      </div>
    );
  }

  const chartData = [{ name: 'Score', value: matchResult.match_percentage, fill: 'var(--accent-teal)' }];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
      >
        
        {/* Header Section */}
        <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2rem' }}>
          <div>
            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '1rem' }}>
              Top Match Candidate
            </span>
            <h1 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, maxWidth: '800px' }}>
              {matchResult.trial_title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>NCT: <strong style={{color: '#fff'}}>{matchResult.trial_nct_id}</strong></span>
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                <CheckCircle2 size={14} /> Verified Trial
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area: Left (Info + Criteria), Right (Score + Actions) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: Main Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Section 1: Patient Information (Bento Grid inside) */}
            <motion.section variants={itemVariants}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <User size={20} color="var(--accent-teal)" />
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Patient Information</h2>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                
                {(() => {
                  const DetailRow = ({ label, value }) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{ color: value ? 'var(--text-primary)' : '#57606a', fontStyle: value ? 'normal' : 'italic', textAlign: 'right', fontWeight: 500 }}>
                        {value || "N/A"}
                      </span>
                    </div>
                  );

                  return (
                    <>
                      {/* Diagnosis Card */}
                      <div className="premium-panel" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                          <Dna size={16} style={{ color: 'var(--accent-teal)' }} />
                          <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diagnosis</h3>
                        </div>
                        <DetailRow label="Disease" value={patient.disease} />
                        <DetailRow label="Mutation" value={patient.genetic_mutation} />
                        
                        {/* Custom Orphanet ID Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Orphanet ID</span>
                          {patient.orphanet_verified ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 500, background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                              <CheckCircle2 size={12} /> {patient.orphanet_id} (Verified)
                            </span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontStyle: 'italic', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                              <AlertCircle size={12} /> Not Verified
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Vitals Card */}
                      <div className="premium-panel" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                          <Heart size={16} style={{ color: '#ec4899' }} />
                          <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demographics</h3>
                        </div>
                        <DetailRow label="Age" value={patient.age} />
                        <DetailRow label="Sex" value={patient.sex} />
                        <DetailRow label="BMI" value={patient.bmi} />
                      </div>

                      {/* Biomarkers Card */}
                      <div className="premium-panel" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                          <Beaker size={16} style={{ color: '#3b82f6' }} />
                          <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Biomarkers</h3>
                        </div>
                        <DetailRow label="eGFR" value={patient.egfr} />
                        <DetailRow label="ALT" value={patient.alt} />
                        <DetailRow label="AST" value={patient.ast} />
                      </div>

                      {/* Symptoms Card */}
                      <div className="premium-panel" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                          <Activity size={16} style={{ color: '#f59e0b' }} />
                          <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Symptoms</h3>
                        </div>
                        <DetailRow label="Severity" value={patient.symptom_severity} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '0.5rem' }}>
                          {patient.phenotypes && patient.phenotypes.length > 0 ? patient.phenotypes.slice(0,4).map((p, i) => (
                            <span key={i} style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p}</span>
                          )) : <span style={{fontSize: '0.75rem', color: '#57606a', fontStyle: 'italic'}}>No specific phenotypes listed</span>}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.section>

            {/* Section 2: Trial Conditions Checklist */}
            <motion.section variants={itemVariants}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={20} color="var(--accent-teal)" />
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Trial Conditions</h2>
              </div>
              
              <div className="premium-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {matchResult.criteria_results.map((crit, idx) => {
                  const isPass = crit.status === 'PASS';
                  const isFail = crit.status === 'FAIL';
                  const borderColor = isPass ? 'rgba(16, 185, 129, 0.4)' : (isFail ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)');
                  const bgColor = isPass ? 'rgba(16, 185, 129, 0.05)' : (isFail ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)');
                  const iconColor = isPass ? '#10b981' : (isFail ? '#ef4444' : '#f59e0b');

                  return (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: bgColor, borderRadius: '8px', border: `1px solid ${borderColor}`, borderLeft: `4px solid ${iconColor}` }}>
                      <div style={{ marginTop: '0.125rem', flexShrink: 0 }}>
                        {isPass && <CheckCircle2 size={18} color={iconColor} />}
                        {isFail && <XCircle size={18} color={iconColor} />}
                        {!isPass && !isFail && <AlertCircle size={18} color={iconColor} />}
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{crit.criterion_text}</p>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>{crit.evidence}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.section>

          </div>

          {/* RIGHT COLUMN: Sticky Sidebar (Score & Actions) */}
          <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Match Score Panel */}
            <motion.div variants={itemVariants} className="premium-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(145deg, var(--bg-primary) 0%, rgba(20,20,20,1) 100%)' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Match</h3>
              
              <div style={{ width: '220px', height: '220px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="75%" outerRadius="100%" barSize={12} data={chartData} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} clockWise dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.05em' }}>{matchResult.match_percentage}%</span>
                </div>
              </div>
              
              <span style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-teal)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '24px', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                {matchResult.eligibility_status.toUpperCase()}
              </span>
            </motion.div>

            {/* Actions Panel */}
            <motion.div variants={itemVariants} className="premium-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Need help understanding why this patient was matched or rejected? 
              </p>
              <button 
                onClick={() => setShowAiModal(true)}
                style={{ 
                  width: '100%',
                  padding: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem', 
                  background: 'var(--text-primary)', 
                  color: 'var(--bg-primary)', 
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(255,255,255,0.1)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,255,255,0.15)' }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,255,255,0.1)' }}
              >
                <Sparkles size={16} /> AI Simplification
              </button>
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* Full Screen AI Explanation Modal */}
      <AnimatePresence>
        {showAiModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(12px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              boxSizing: 'border-box'
            }}
          >
            <motion.div 
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              className="premium-panel"
              style={{
                width: '100%',
                maxWidth: '900px',
                height: '85vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                padding: 0
              }}
            >
              {/* Modal Header */}
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-teal)' }}>
                  <Sparkles size={24} />
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>AI Simplification</h2>
                </div>
                <button 
                  onClick={() => setShowAiModal(false)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '2.5rem', overflowY: 'auto', flex: 1 }} className="markdown-body">
                <ReactMarkdown>{explanation}</ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
