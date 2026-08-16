import React from 'react';
import { Table, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Stage3_Conclusion({ observations }) {
  // Use a fallback in case they jump here without completing experiment (should be locked, but safety first)
  const results = observations || {};

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', fontSize: '1.5rem' }}>Table 3.1: Conclusion</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Here are the results of your predictions and observations. 
          Notice that the bulb only glows when there is a continuous path from one terminal of the cell to the other.
        </p>
      </div>

      <div style={{ overflowX: 'auto', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)', width: '10%' }}>S.No.</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)', width: '50%' }}>Arrangement</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)', width: '20%' }}>Your Prediction</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)', width: '20%' }}>Observation</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((id) => {
              const res = results[id];
              if (!res) return null;

              return (
                <motion.tr 
                  key={id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: id * 0.1 }}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{id}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-heading)' }}>
                    {id === 1 && "Both wires connected correctly"}
                    {id === 2 && "Red connected, Black loose"}
                    {id === 3 && "Black connected, Red loose"}
                    {id === 4 && "Both connected to same terminal"}
                    {id === 5 && "Black connected to green, Red loose"}
                    {id === 6 && "Wires reversed (Red to Yellow, Black to Green)"}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: res.prediction ? 'var(--success)' : '#ef4444' }}>
                      {res.prediction ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {res.prediction ? 'Glow' : 'No Glow'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: res.observation ? 'var(--success)' : '#ef4444' }}>
                      {res.observation ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {res.observation ? 'Glows' : 'Does not glow'}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
