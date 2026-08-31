import React, { useState } from 'react';
import { Check, ChevronRight, HelpCircle } from 'lucide-react';

export const SEQUENCES = [
  { id: 1, seq: "1, 1, 1, 1, 1, 1, 1, ...", rule: "All 1's", next: ["1", "1", "1"] },
  { id: 2, seq: "1, 2, 3, 4, 5, 6, 7, ...", rule: "Counting numbers", next: ["8", "9", "10"] },
  { id: 3, seq: "1, 3, 5, 7, 9, 11, 13, ...", rule: "Odd numbers", next: ["15", "17", "19"] },
  { id: 4, seq: "2, 4, 6, 8, 10, 12, 14, ...", rule: "Even numbers", next: ["16", "18", "20"] },
  { id: 5, seq: "1, 3, 6, 10, 15, 21, 28, ...", rule: "Triangular numbers", next: ["36", "45", "55"] },
  { id: 6, seq: "1, 4, 9, 16, 25, 36, 49, ...", rule: "Squares", next: ["64", "81", "100"] },
  { id: 7, seq: "1, 8, 27, 64, 125, 216, ...", rule: "Cubes", next: ["343", "512", "729"] },
  { id: 8, seq: "1, 2, 3, 5, 8, 13, 21, ...", rule: "Virahānka numbers", next: ["34", "55", "89"] },
  { id: 9, seq: "1, 2, 4, 8, 16, 32, 64, ...", rule: "Powers of 2", next: ["128", "256", "512"] },
  { id: 10, seq: "1, 3, 9, 27, 81, 243, 729, ...", rule: "Powers of 3", next: ["2187", "6561", "19683"] }
];

const SequenceRow = ({ data, isSolved, onSolve }) => {
  const [ruleRevealed, setRuleRevealed] = useState(false);
  const [inputs, setInputs] = useState(["", "", ""]);
  const [status, setStatus] = useState('idle');

  const handleCheck = () => {
    if (isSolved) return;
    const isCorrect = inputs.every((val, idx) => val.trim() === data.next[idx]);
    if (isCorrect) {
      setStatus('success');
      setRuleRevealed(true);
      onSolve(data.id);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 1500);
    }
  };

  const handleInputChange = (idx, val) => {
    if (isSolved) return;
    const newInputs = [...inputs];
    newInputs[idx] = val;
    setInputs(newInputs);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: status === 'error' ? 'rgba(239, 68, 68, 0.1)' : (isSolved ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255, 255, 255, 0.02)'),
      border: `1px solid ${status === 'error' ? 'rgba(239, 68, 68, 0.5)' : (isSolved ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)')}`,
      borderRadius: '12px',
      marginBottom: '12px',
      transition: 'all 0.3s ease',
      boxShadow: status === 'error' ? '0 0 10px rgba(239, 68, 68, 0.2)' : 'none',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
      }}>
        <div style={{ flex: 1, fontSize: '18px', fontWeight: 'bold', color: '#f8fafc', letterSpacing: '1px' }}>
          {data.seq}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            onClick={() => setRuleRevealed(true)}
            style={{
              background: ruleRevealed ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${ruleRevealed ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
              padding: '6px 16px',
              borderRadius: '20px',
              color: ruleRevealed ? '#60a5fa' : '#94a3b8',
              fontSize: '13px',
              fontWeight: '700',
              cursor: ruleRevealed ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              minWidth: '160px',
              justifyContent: 'center'
            }}
          >
            {ruleRevealed ? data.rule : <><HelpCircle size={14} /> Reveal Rule</>}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 'bold', marginRight: '4px' }}>next:</span>
            {[0, 1, 2].map(idx => (
              <input
                key={idx}
                value={isSolved ? data.next[idx] : inputs[idx]}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                disabled={isSolved}
                style={{
                  width: '50px',
                  height: '40px',
                  background: isSolved ? 'transparent' : '#0f172a',
                  border: `1px solid ${isSolved ? 'transparent' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '8px',
                  color: isSolved ? '#22c55e' : '#f8fafc',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            ))}
          </div>

          <button
            onClick={handleCheck}
            disabled={isSolved}
            style={{
              background: isSolved ? '#22c55e' : '#3b82f6',
              color: '#fff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: isSolved ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s',
              opacity: isSolved ? 0.9 : 1,
              boxShadow: isSolved ? '0 0 15px rgba(34, 197, 94, 0.3)' : 'none'
            }}
          >
            {isSolved ? <><Check size={16} /> Solved</> : 'Check'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function NumberSequencesTable({ onNext }) {
  const [page, setPage] = useState(1);
  const [solvedIds, setSolvedIds] = useState([]);

  const currentSequences = page === 1 ? SEQUENCES.slice(0, 5) : SEQUENCES.slice(5, 10);

  const handleSolve = (id) => {
    if (!solvedIds.includes(id)) {
      setSolvedIds([...solvedIds, id]);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#0a0f1d',
      padding: '40px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#f8fafc', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Table 1 • Examples of number sequences
          <span style={{ fontSize: '14px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '4px 12px', borderRadius: '12px' }}>
            Page {page} of 2
          </span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
          Tap any row to reveal its rule. Then fill in the next three numbers and press Check.
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto', paddingRight: '10px' }}>
        <div style={{ background: '#111827', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          {currentSequences.map(seq => (
            <SequenceRow
              key={seq.id}
              data={seq}
              isSolved={solvedIds.includes(seq.id)}
              onSolve={handleSolve}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px', gap: '16px' }}>
        {page === 2 && (
          <button
            onClick={() => setPage(1)}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Back to Page 1
          </button>
        )}
        
        {page === 1 ? (
          <button
            onClick={() => setPage(2)}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Next Page (6-10) <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={onNext}
            style={{
              background: '#22c55e',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
          >
            Next Section <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
