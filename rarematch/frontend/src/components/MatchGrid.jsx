import React from 'react';
import '../index.css';

export function MatchGrid({ matchResults }) {
  if (!matchResults) {
    return (
      <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 1rem 1rem 0' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 600 }}>Match Intensity Grid</h2>
        <div className="premium-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="text-muted" style={{ fontStyle: 'italic' }}>Run matching evaluation to view candidate clinical trials...</p>
        </div>
      </div>
    );
  }

  if (matchResults.status !== 'SUCCESS') {
    return (
      <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 1rem 1rem 0' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 600 }}>Match Intensity Grid</h2>
        <div className="premium-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#ff4d4d' }}>No matching trials located in vector database.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 2rem)', overflowY: 'auto', boxSizing: 'border-box', paddingRight: '0.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 600 }}>Match Intensity Grid</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {matchResults.reports.map((report, idx) => {
          const match = report.match_report;
          const isEligible = match.eligibility_status.includes('ELIGIBLE') && !match.eligibility_status.includes('IN');
          const isUncertain = match.eligibility_status.includes('UNCERTAIN');
          
          let statusStyle = {
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.65rem',
            fontWeight: 600,
            display: 'inline-block',
            letterSpacing: '0.05em'
          };
          
          if (isEligible) {
            statusStyle = { ...statusStyle, backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.2)' };
          } else if (isUncertain) {
            statusStyle = { ...statusStyle, backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.2)' };
          } else {
            statusStyle = { ...statusStyle, backgroundColor: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.2)' };
          }

          return (
            <div key={idx} className="premium-card premium-card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500 }}>{match.trial_nct_id}</span>
                  <h3 style={{ fontSize: '1.25rem', margin: '4px 0 0 0', fontWeight: 600, lineHeight: '1.3' }}>{match.trial_title}</h3>
                </div>
                <div style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-accent)' }}>
                  {match.match_percentage}%
                </div>
              </div>

              <div>
                <span style={statusStyle}>{match.eligibility_status}</span>
              </div>

              {/* Criteria details */}
              <div className="premium-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500 }}>CRITERIA STATUS DETAILED CHECK</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {match.criteria_results.map((c, cIdx) => {
                    const cPass = c.status === 'PASS';
                    const cFail = c.status === 'FAIL';
                    const cColor = cPass ? '#34d399' : (cFail ? '#f87171' : '#fbbf24');
                    
                    return (
                      <div key={cIdx} style={{ fontSize: '0.8125rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', paddingTop: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.criterion_text}</span>
                          <span style={{ color: cColor, fontWeight: 600 }}>{c.status}</span>
                        </div>
                        <span className="text-muted" style={{ fontSize: '0.75rem', lineHeight: '1.5', display: 'block' }}>{c.evidence}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gemini Physician Advice Report */}
              <div className="premium-panel">
                <span className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500, display: 'block', marginBottom: '0.75rem' }}>GEMINI PHYSICIAN REPORT</span>
                <div style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                  {report.explanation_md}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
