import React from 'react';
import { motion } from 'framer-motion';
import { Table, CheckCircle, XCircle, ArrowUpSquare, Train, Footprints } from 'lucide-react';

export default function Stage3_Conclusion({ observations }) {
  const objects = [
    { id: 'car', name: 'Toy car' },
    { id: 'marble', name: 'Marble' },
    { id: 'pencil', name: 'Pencil (rolled)' },
    { id: 'box', name: 'Small box (pushed)' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', fontSize: '1.5rem' }}>Table 5.1: Observation of Linear Motion</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Here are the results of your experiment observations.
        </p>
      </div>

      {/* Observation Table */}
      <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-heading)' }}>Object</th>
              <th style={{ padding: '1rem', color: 'var(--text-heading)' }}>Observation (Straight Line: Yes/No)</th>
            </tr>
          </thead>
          <tbody>
            {objects.map((obj, index) => {
              const obs = observations[obj.id];

              return (
                <motion.tr 
                  key={obj.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td style={{ padding: '1rem', color: 'var(--text-heading)', fontWeight: '500' }}>{obj.name}</td>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {obs ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontWeight: 'bold' }}>
                        <CheckCircle size={16} /> Yes (Moved in a straight line)
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontWeight: 'bold' }}>
                        <XCircle size={16} /> No
                      </span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Real World Examples */}
      <div style={{ marginTop: '1rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', fontSize: '1.25rem' }}>Real-World Examples of Linear Motion</h3>
        <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-secondary)' }}>
          Look around your classroom or playground. Can you identify other objects that move in a straight line?
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#3b82f615', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpSquare size={32} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Elevator</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Moving straight up and down between floors.</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#10b98115', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Train size={32} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Train</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Moving forward on a straight section of track.</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f59e0b15', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Footprints size={32} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Walking</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>A student walking carefully along a marked straight line.</p>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
