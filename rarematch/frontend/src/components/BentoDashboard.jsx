import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Activity, User, Dna, Beaker, Heart, Droplet } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import ReactMarkdown from 'react-markdown';

export function BentoDashboard({ matchState, persona }) {
  const [activeTab, setActiveTab] = useState('criteria');
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridAutoRows: 'minmax(100px, auto)',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 0',
        height: 'calc(100vh - 4rem)',
        overflowY: 'auto'
      }}
    >
      {/* Top Banner: Trial Title */}
      <motion.div variants={itemVariants} className="premium-panel" style={{ position: 'relative', gridColumn: 'span 12', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0 8px 0 12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Patient ID: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{patient.patient_id}</span>
        </div>
        <div>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Match</span>
          <h2 style={{ margin: '0.5rem 0 0 0', color: 'var(--text-primary)', fontSize: '1.5rem' }}>{matchResult.trial_title}</h2>
          <span style={{ color: 'var(--accent-teal)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            NCT Number (National Clinical Trial number): {matchResult.trial_nct_id} 
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}><CheckCircle2 size={12} /> Verified</span>
          </span>
        </div>
        <div style={{ padding: '0.5rem 1rem', borderRadius: '20px', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-teal)', fontWeight: 600, fontSize: '0.875rem', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
          {persona.toUpperCase()} MODE
        </div>
      </motion.div>

      {/* Left Column (Patient + Chart) */}
      <motion.div variants={itemVariants} style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Expanded Patient Profile */}
        <div className="premium-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            <User size={20} />
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 500 }}>Patient Profile</h3>
          </div>
          
          <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Diagnosis & Genomics */}
            <motion.div variants={itemVariants} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Dna size={14} style={{ color: 'var(--accent-teal)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>DIAGNOSIS & GENOMICS</span>
              </div>
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>{patient.disease}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginTop: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Orphanet ID</span>
                  <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {patient.orphanet_id || "Unknown"}
                    {patient.orphanet_verified ? (
                      <span title="Verified via Orphanet" style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}><CheckCircle2 size={12} /> Verified</span>
                    ) : (
                      <span title="Unverified Disease" style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '2px' }}><AlertCircle size={12} /> Unverified</span>
                    )}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Mutation</span>
                  <span style={{ color: 'var(--text-primary)' }}>{patient.genetic_mutation || "Unknown"}</span>
                </div>
              </div>
            </motion.div>

            {/* Demographics & Vitals */}
            <motion.div variants={itemVariants} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart size={14} style={{ color: '#ec4899' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>DEMOGRAPHICS & VITALS</span>
              </div>
              <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                <div><span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>AGE</span><span style={{ color: 'var(--text-primary)' }}>{patient.age}</span></div>
                <div><span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>SEX</span><span style={{ color: 'var(--text-primary)' }}>{patient.sex}</span></div>
                <div><span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>WEIGHT / BMI</span><span style={{ color: 'var(--text-primary)' }}>{patient.weight_kg} kg / {patient.bmi}</span></div>
                <div><span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>HEART RATE</span><span style={{ color: 'var(--text-primary)' }}>{patient.heart_rate}</span></div>
              </div>
            </motion.div>

            {/* Laboratory Biomarkers */}
            <motion.div variants={itemVariants} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Beaker size={14} style={{ color: '#3b82f6' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>LABORATORY BIOMARKERS</span>
              </div>
              <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                <div><span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>KIDNEY (eGFR)</span><span style={{ color: 'var(--text-primary)' }}>{patient.kidney_egfr}</span></div>
                <div><span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>LIVER (ALT)</span><span style={{ color: 'var(--text-primary)' }}>{patient.liver_alt}</span></div>
                <div><span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>BLOOD GROUP</span><span style={{ color: 'var(--text-primary)' }}>{patient.blood_group}</span></div>
              </div>
            </motion.div>

            {/* Clinical Symptoms */}
            <motion.div variants={itemVariants} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={14} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>CLINICAL SYMPTOMS</span>
              </div>
              <div style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {patient.phenotypes.map((p, i) => (
                  <span key={i} style={{ padding: '0.25rem 0.75rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '12px', fontSize: '0.75rem' }}>
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* Radial Chart */}
        <div className="premium-panel" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 500, alignSelf: 'flex-start' }}>Match Score</h3>
          <div style={{ width: '100%', height: '200px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={15} data={chartData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar minAngle={15} background={{ fill: 'rgba(255,255,255,0.05)' }} clockWise dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{matchResult.match_percentage}%</span>
            </div>
          </div>
          <span style={{ marginTop: '1rem', padding: '0.25rem 1rem', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-teal)', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600 }}>
            {matchResult.eligibility_status}
          </span>
        </div>

      </motion.div>

      {/* Right Column: Tabbed Interface */}
      <motion.div variants={itemVariants} className="premium-panel" style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Tab Header */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 1rem' }}>
          <button 
            onClick={() => setActiveTab('criteria')}
            style={{ padding: '1.25rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'criteria' ? '2px solid var(--accent-teal)' : '2px solid transparent', color: activeTab === 'criteria' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <CheckCircle2 size={16} /> Trial Criteria Matching
          </button>
          <button 
            onClick={() => setActiveTab('explanation')}
            style={{ padding: '1.25rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'explanation' ? '2px solid var(--accent-teal)' : '2px solid transparent', color: activeTab === 'explanation' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Activity size={16} /> AI Explanation
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          
          {activeTab === 'criteria' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {matchResult.criteria_results.map((crit, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: crit.status === 'PASS' ? '3px solid var(--accent-teal)' : (crit.status === 'FAIL' ? '3px solid #ff4a4a' : '3px solid #ffb84a') }}>
                  <div style={{ marginTop: '0.125rem' }}>
                    {crit.status === 'PASS' && <CheckCircle2 size={18} color="var(--accent-teal)" />}
                    {crit.status === 'FAIL' && <XCircle size={18} color="#ff4a4a" />}
                    {crit.status === 'UNCERTAIN' && <AlertCircle size={18} color="#ffb84a" />}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{crit.criterion_text}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{crit.evidence}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'explanation' && (
            <div className="markdown-body" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <ReactMarkdown>{explanation}</ReactMarkdown>
            </div>
          )}

        </div>
      </motion.div>

    </motion.div>
  );
}
