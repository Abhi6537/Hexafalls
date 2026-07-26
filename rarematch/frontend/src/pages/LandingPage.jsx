import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Dna, BrainCircuit, ShieldCheck, Database, FileText, Bot, Sparkles, Workflow, Activity, CheckCircle2, Search, Cpu } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const WorkflowNode = ({ icon: Icon, title, tech, delay }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.3, delay }}
    style={{ 
      position: 'relative',
      width: '260px',
      margin: '0 auto',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      gap: '0.85rem',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-strong)',
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.8)'
    }}
  >
    <div style={{ padding: '0.4rem', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={18} color="var(--text-accent)" />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{title}</h3>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{tech}</span>
    </div>
  </motion.div>
);

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
              
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={containerVariants}
                style={{ textAlign: 'left' }}
              >
                <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <span className="premium-badge">
                    Know Your Trial V2.0
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.875rem' }}>Next-Gen Multi-Agent Architecture</span>
                </motion.div>
                
                <motion.h1 variants={itemVariants} style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.05em' }}>
                  Precision matching. <br />
                  <span className="animated-gradient-text" style={{ 
                    backgroundImage: 'linear-gradient(to right, #3b82f6, #10b981, #8b5cf6, #3b82f6)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'gradientFlow 3s linear infinite'
                  }}>Engineered for rare diseases.</span>
                </motion.h1>
                <style>{`
                  @keyframes gradientFlow {
                    0% { background-position: 0% center; }
                    100% { background-position: -200% center; }
                  }
                `}</style>
                
                <motion.p variants={itemVariants} className="text-muted" style={{ fontSize: '1.15rem', lineHeight: 1.5, marginBottom: '2.5rem', maxWidth: '550px' }}>
                  Leverage our Orchestrator Agent and semantic phenotyping to instantly connect complex clinical profiles with the right trials. Built for speed, accuracy, and trust.
                </motion.p>
                
                <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Link to="/dashboard" className="premium-btn premium-btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                    Launch Dashboard <ArrowRight size={18} />
                  </Link>
                  <a href="#how-it-works" className="premium-btn premium-btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                    View Workflow
                  </a>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ position: 'relative', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--accent-teal)', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%' }} />
                <div style={{ position: 'absolute', width: '200px', height: '200px', background: '#3b82f6', filter: 'blur(80px)', opacity: 0.2, borderRadius: '50%', transform: 'translate(50px, -50px)' }} />

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
                  <Bot size={16} color="#f59e0b" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b' }}>NER Agent Active</span>
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
                { icon: <BrainCircuit size={24} />, title: 'LLM Orchestration', desc: 'Our Orchestrator Agent delegates tasks between specialized micro-agents for high-fidelity evaluation.', tech: 'Orchestrator Agent' },
                { icon: <Dna size={24} />, title: 'Semantic Phenotyping', desc: 'The NER Agent understands the biological context of symptoms, matching HPO phenotypes accurately.', tech: 'BioBERT NER Agent' },
                { icon: <ShieldCheck size={24} />, title: 'Explainable AI', desc: 'Every match includes a physician-level breakdown report detailing exactly why criteria passed or failed.', tech: 'Gemini 2.0 Flash Lite' },
                { icon: <FileText size={24} />, title: 'Automated Ingestion', desc: 'Instantly parse massive patient PDFs and clinical histories into structured phenotype arrays.', tech: 'GPT-2 Data Gen' },
                { icon: <Database size={24} />, title: 'Real-Time Vector Retrieval', desc: 'Millions of clinical trial criteria mapped and retrieved instantly using similarity search.', tech: 'Supabase + ChromaDB' },
                { icon: <Cpu size={24} />, title: 'Multi-Modal Engine', desc: 'Simultaneously cross-references categorical conditions and temporal ERT therapy durations.', tech: 'Python Scoring Engine' }
              ].map((feat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="premium-card"
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                    {feat.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{feat.title}</h3>
                  <p className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.9375rem', margin: 0, marginBottom: '1rem' }}>{feat.desc}</p>
                  <span className="premium-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>{feat.tech}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION (N8N STYLE WORKFLOW) */}
        <section id="how-it-works" style={{ padding: '8rem 0', borderTop: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <div className="content-wrapper">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>The Intelligence Pipeline</h2>
              <p className="text-muted" style={{ fontSize: '1.125rem' }}>A deterministic, multi-agent workflow architecture.</p>
            </div>
            
            <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', padding: '2rem 0' }}>
              
              {/* SVG Connecting Lines Background */}
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '4px', height: '100%', zIndex: 1 }}>
                <svg width="4" height="100%" style={{ display: 'block' }}>
                  <motion.line 
                    x1="2" y1="0" x2="2" y2="100%" 
                    stroke="var(--border-strong)" 
                    strokeWidth="2" 
                    strokeDasharray="8 8"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 2, ease: "linear" }}
                  />
                  <motion.circle 
                    cx="2" cy="0" r="4" fill="#3b82f6"
                    animate={{ cy: ["0%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />
                </svg>
              </div>

              {/* Nodes */}
              <WorkflowNode 
                icon={FileText} 
                title="Data Ingestion" 
                tech="GPT-2 Data Gen" 
                delay={0.2}
              />
              
              <WorkflowNode 
                icon={Dna} 
                title="Entity Extraction" 
                tech="BioBERT NER Agent" 
                delay={0.6}
              />

              <WorkflowNode 
                icon={Database} 
                title="Semantic Search" 
                tech="Supabase + ChromaDB" 
                delay={1.0}
              />

              <WorkflowNode 
                icon={Workflow} 
                title="Rules Engine" 
                tech="Orchestrator Agent" 
                delay={1.4}
              />

              <WorkflowNode 
                icon={Sparkles} 
                title="Explainability" 
                tech="Gemini 2.0 Flash Lite" 
                delay={1.8}
              />
              
            </div>
          </div>
        </section>

        {/* CASE STUDIES SECTION */}
        <section id="case-studies" style={{ padding: '8rem 0', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="content-wrapper">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Success Stories</h2>
              <p className="text-muted" style={{ fontSize: '1.125rem' }}>Real-world examples of semantic matching in action.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              
              {/* Case Study 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="premium-panel"
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'linear-gradient(145deg, rgba(16,185,129,0.05) 0%, rgba(0,0,0,0) 100%)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="premium-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.2)' }}>Fabry Disease</span>
                  <CheckCircle2 size={20} color="#10b981" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>The Semantic Breakthrough</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  A clinical trial protocol required "chronic nerve pain". The patient's PDF note stated "severe distal paresthesia". Traditional keyword matchers completely missed this connection.
                </p>
                <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-light)', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Result</span>
                    <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>98% Semantic Match</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-primary)' }}>BioBERT mapped both terms to the exact same HPO Phenotype (HP:0003401), successfully enrolling the patient.</p>
                </div>
              </motion.div>

              {/* Case Study 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="premium-panel"
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(59, 130, 246, 0.3)', background: 'linear-gradient(145deg, rgba(59,130,246,0.05) 0%, rgba(0,0,0,0) 100%)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="premium-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.2)' }}>Gaucher Disease</span>
                  <Search size={20} color="#3b82f6" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Temporal Constraint Logic</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  The trial excluded patients on Enzyme Replacement Therapy (ERT) for less than 12 months. The unstructured clinical note vaguely mentioned "ERT started last November."
                </p>
                <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-light)', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Result</span>
                    <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600 }}>Calculated: 9 Months</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-primary)' }}>The Orchestrator Agent successfully calculated the temporal gap and correctly flagged the patient as Ineligible.</p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section style={{ padding: '8rem 0', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
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
