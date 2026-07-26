import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Dna, BrainCircuit, ShieldCheck } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="page-container">
      <Navbar />

      <main style={{ flex: 1, position: 'relative' }}>
        {/* Subtle top glow */}
        <div className="glow-effect" />

        {/* HERO SECTION */}
        <section style={{ 
          minHeight: '85vh', 
          display: 'flex', 
          alignItems: 'center',
          position: 'relative',
          paddingTop: '4rem',
          paddingBottom: '4rem',
          overflow: 'hidden'
        }}>
          
          <div className="content-wrapper" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              
              {/* Left Column: Text */}
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={containerVariants}
                style={{ textAlign: 'left' }}
              >
                <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                  <span className="premium-badge">
                    RareMatch V2.0
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.875rem' }}>Next-Gen Multi-Agent Architecture</span>
                </motion.div>
                
                <motion.h1 variants={itemVariants} style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
                  Precision matching.<br/>
                  <span className="text-gradient">Engineered for rare diseases.</span>
                </motion.h1>
                
                <motion.p variants={itemVariants} className="text-muted" style={{ fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '550px' }}>
                  Leverage generative multi-agent systems and semantic phenotyping to instantly connect complex clinical profiles with the right trials. Built for speed, accuracy, and trust.
                </motion.p>
                
                <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Link to="/dashboard" className="premium-btn premium-btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                    Launch Dashboard <ArrowRight size={18} />
                  </Link>
                  <a href="#how-it-works" className="premium-btn premium-btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                    Explore Technology
                  </a>
                </motion.div>
              </motion.div>

              {/* Right Column: Glassmorphism Animation */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ position: 'relative', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {/* Background Glow */}
                <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--accent-teal)', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%' }} />
                <div style={{ position: 'absolute', width: '200px', height: '200px', background: '#3b82f6', filter: 'blur(80px)', opacity: 0.2, borderRadius: '50%', transform: 'translate(50px, -50px)' }} />

                {/* Central Glass Card */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  style={{ 
                    position: 'relative',
                    width: '320px', 
                    height: '400px', 
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                    style={{ marginBottom: '2rem' }}
                  >
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Dna size={48} color="var(--accent-teal)" />
                    </div>
                  </motion.div>
                  
                  <div style={{ textAlign: 'center', padding: '0 2rem' }}>
                     <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--text-primary)' }}>Genomic Parsing Engine</h3>
                     <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Semantic Phenotype Mapping Active</p>
                  </div>
                </motion.div>

                {/* Orbiting Elements */}
                <motion.div 
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                  style={{ position: 'absolute', top: '10%', right: '5%', zIndex: 3, padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', backdropFilter: 'blur(8px)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <ShieldCheck size={16} color="#10b981" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>Orphanet Verified</span>
                </motion.div>

                <motion.div 
                  animate={{ y: [5, -5, 5] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 2 }}
                  style={{ position: 'absolute', bottom: '15%', left: '0%', zIndex: 3, padding: '0.75rem 1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', backdropFilter: 'blur(8px)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <BrainCircuit size={16} color="#f59e0b" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b' }}>Agentic Evaluation</span>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" style={{ padding: '8rem 0', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="content-wrapper">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '5rem' }}
            >
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Architected for Complexity</h2>
              <p className="text-muted" style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>Traditional keyword matching fails on rare disease phenotypes. We use semantic intelligence to bridge the gap.</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {[
                { icon: <BrainCircuit size={24} />, title: 'LLM Orchestration', desc: 'Multiple Gemini agents collaborate to parse, extract, and evaluate complex clinical inclusion/exclusion criteria.' },
                { icon: <Dna size={24} />, title: 'Semantic Phenotyping', desc: 'BioBERT understands the biological context of symptoms, matching HPO phenotypes accurately even with differing terminology.' },
                { icon: <ShieldCheck size={24} />, title: 'Explainable AI', desc: 'Every match includes a physician-level breakdown report detailing exactly why criteria passed or failed.' }
              ].map((feat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="premium-card"
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                    {feat.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{feat.title}</h3>
                  <p className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.9375rem', margin: 0 }}>{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" style={{ padding: '8rem 0', borderTop: '1px solid var(--border-light)' }}>
          <div className="content-wrapper">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>The Intelligence Pipeline</h2>
                <p className="text-muted" style={{ fontSize: '1.125rem' }}>A transparent, deterministic workflow designed for clinical validation.</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { step: '01', title: 'Data Ingestion', desc: 'Clinical notes are parsed. BioBERT extracts semantic entities (phenotypes, genomic variants, labs).' },
                  { step: '02', title: 'Vector Retrieval', desc: 'Patient phenotypes are converted to embeddings. We query a ChromaDB vector store of active NCT trial protocols.' },
                  { step: '03', title: 'Agentic Evaluation', desc: 'Matching agents cross-reference numeric boundaries (eGFR, Age) and temporal limits (ERT duration) against trial protocols.' }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="premium-panel"
                    style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}
                  >
                    <div className="text-muted" style={{ fontSize: '1.5rem', fontWeight: 400, fontFamily: 'var(--font-mono)' }}>
                      {item.step}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
                      <p className="text-muted" style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section style={{ padding: '8rem 0', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
          <div className="glow-effect" style={{ top: 'auto', bottom: 0, transform: 'translateX(-50%) rotate(180deg)' }} />
          <div className="content-wrapper" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ maxWidth: '600px', margin: '0 auto' }}
            >
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Ready to accelerate discovery?</h2>
              <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '2.5rem' }}>Experience the multi-agent architecture matching complex rare disease profiles in real-time.</p>
              <Link to="/dashboard" className="premium-btn premium-btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
                Open Dashboard UI
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
