import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function EducationalSidebar({
  title = "Did you know?",
  insights = [],
  faqs = [],
  tips = []
}) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <aside style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '2rem', marginTop: '1rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>🧠</span>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)', marginTop: '4px' }}>
            {title}
          </h4>
        </div>

        {/* Insights Section */}
        {insights.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>📌</span>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                  Science Insights
                </div>
                <ul style={{ margin: '0.4rem 0 0 0', paddingLeft: '1rem', fontSize: '0.825rem', color: 'var(--text-faint)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {insights.map((insight, idx) => (
                    <li key={idx} style={{ lineHeight: '1.5', textAlign: 'left' }}>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>❓</span>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                  Why?
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {faqs.map((faq, idx) => (
                    <div key={idx} style={{ background: 'var(--neutral-bg)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <button 
                        onClick={() => toggleFaq(idx)}
                        style={{ 
                          width: '100%', 
                          background: 'none', 
                          border: 'none', 
                          padding: '0.6rem 0.8rem', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-heading)', paddingRight: '0.5rem', lineHeight: '1.3' }}>
                          {faq.question}
                        </span>
                        {expandedFaq === idx ? (
                          <ChevronUp size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        ) : (
                          <ChevronDown size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ padding: '0 0.8rem 0.8rem 0.8rem', fontSize: '0.75rem', color: 'var(--text-faint)', lineHeight: '1.4' }}>
                              {faq.answer.split('\n').map((line, i) => (
                                <div key={i} style={{ marginBottom: i !== faq.answer.split('\n').length - 1 ? '0.4rem' : 0 }}>
                                  {line}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Tips Section */}
        {tips.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>💡</span>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                  Quick Tips
                </div>
                <ul style={{ margin: '0.4rem 0 0 0', paddingLeft: '1rem', fontSize: '0.825rem', color: 'var(--text-faint)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {tips.map((tip, idx) => (
                    <li key={idx} style={{ lineHeight: '1.5', textAlign: 'left' }}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
