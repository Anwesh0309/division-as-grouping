import React, { useState, useCallback, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds, celebrate, cheer } from '../utils/audio';
import {
  simulateStation1Intro,
  simulateStation2Intro,
  simulateStation3Intro,
  simulateStation4Intro,
} from '../utils/narration';

const STATIONS = [
  { id: 0, title: 'Concrete Groups', subtitle: 'Drag into baskets', icon: '🍎' },
  { id: 1, title: 'Pictorial Groups', subtitle: 'Circle equal sets', icon: '⭕' },
  { id: 2, title: 'Skip Grouping', subtitle: 'Number line jumps', icon: '📏' },
  { id: 3, title: 'Number Sentence', subtitle: 'Abstract division', icon: '📝' },
];

const DIVISOR_OPTIONS = [2, 3, 4, 5];

// Generates a unique divisor/quotient pair for each round index so "Try Another"
// always presents a different question.
function getDivisorForRound(round, offset = 1) {
  return DIVISOR_OPTIONS[(round * 3 + offset) % DIVISOR_OPTIONS.length];
}
function getQuotientForRound(round, maxExtra = 2) {
  return (round % (maxExtra + 1)) + 2; // cycles 2 … (2+maxExtra)
}

function Station1({ audioEnabled, onNext }) {
  const [round, setRound] = useState(0);
  // Re-derive divisor/quotient from round so each round presents a different question
  const divisor = getDivisorForRound(round, 1);
  const quotient = getQuotientForRound(round, 2); // cycles 2, 3, 4
  const dividend = divisor * quotient;
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState([]);
  const narRef = useRef(null);

  useEffect(() => {
    setGroups([]);
    setCurrentGroup([]);
  }, [round]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation1Intro(dividend, divisor), true);
    }
    return () => {
      narRef.current?.cancel();
    };
  }, [dividend, divisor, audioEnabled, round]);

  const remaining = dividend - groups.reduce((a, g) => a + g.length, 0) - currentGroup.length;

  const addToGroup = () => {
    if (remaining <= 0) return;
    sounds.click();
    const next = [...currentGroup, '🍎'];
    if (next.length === divisor) {
      setGroups((g) => [...g, next]);
      setCurrentGroup([]);
      if (groups.length + 1 === quotient) {
        sounds.correct();
        narRef.current?.cancel();
        if (audioEnabled) {
          narRef.current = narrate(
            [celebrate(`${dividend} divided by ${divisor} equals ${quotient} groups!`), cheer('Great grouping!')],
            true
          );
        }
      }
    } else {
      setCurrentGroup(next);
    }
  };

  const done = groups.length === quotient;

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header">
        <h2>🍎 Concrete Grouping</h2>
      </div>
      <p className="station-instruction">
        Put <strong className="text-gold">{divisor}</strong> apples in each basket. Tap apples to group them!
      </p>
      <div className="grouping-pool">
        {Array.from({ length: remaining }, (_, i) => (
          <button key={i} className="grouping-item" onClick={addToGroup} disabled={done}>
            🍎
          </button>
        ))}
        {currentGroup.map((e, i) => (
          <span key={`c${i}`} className="grouping-item static">
            {e}
          </span>
        ))}
      </div>
      <div className="grouping-containers">
        {Array.from({ length: quotient }, (_, i) => (
          <div key={i} className={`grouping-basket ${groups[i] ? 'filled' : ''}`}>
            <div className="basket-label">🧺 Basket {i + 1}</div>
            <div className="basket-items">{groups[i]?.join(' ') || '...'}</div>
          </div>
        ))}
      </div>
      {done && (
        <div style={{ animation: 'bounceIn 0.5s', marginTop: 16 }}>
          <div className="equation-display">
            {dividend} ÷ {divisor} = {quotient} 🎉
          </div>
          <button
            className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`}
            onClick={() => {
              if (round < 2) setRound((r) => r + 1);
              else onNext();
            }}
          >
            {round < 2 ? 'Try Another →' : 'Next Station →'}
          </button>
        </div>
      )}
      <div className="round-label">Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

function Station2({ audioEnabled, onNext }) {
  const [round, setRound] = useState(0);
  // Re-derive divisor/quotient from round so each round presents a different question
  const divisor = getDivisorForRound(round, 0);
  const quotient = getQuotientForRound(round, 2); // cycles 2, 3, 4
  const dividend = divisor * quotient;
  const [selected, setSelected] = useState([]);
  const [groupNum, setGroupNum] = useState(0);
  const narRef = useRef(null);

  useEffect(() => {
    setSelected([]);
    setGroupNum(0);
  }, [round]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation2Intro(), true);
    }
    return () => {
      narRef.current?.cancel();
    };
  }, [audioEnabled, round]);

  const handleDot = (idx) => {
    if (selected.includes(idx)) return;
    const next = [...selected, idx];
    setSelected(next);
    sounds.click();
    if (next.length % divisor === 0) {
      setGroupNum(next.length / divisor);
      if (next.length === dividend) {
        sounds.correct();
        narRef.current?.cancel();
        if (audioEnabled) {
          narRef.current = narrate(
            [celebrate(`${dividend} divided by ${divisor} equals ${quotient} groups!`)],
            true
          );
        }
      }
    }
  };

  const done = selected.length === dividend;

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header">
        <h2>⭕ Pictorial Grouping</h2>
      </div>
      <p className="station-instruction">
        Tap dots to make groups of <strong className="text-gold">{divisor}</strong>. Groups made:{' '}
        <strong className="text-coral">{groupNum}</strong>
      </p>
      <div className="dot-grid">
        {Array.from({ length: dividend }, (_, i) => (
          <button
            key={i}
            className={`dot-cell ${selected.includes(i) ? 'selected' : ''}`}
            onClick={() => handleDot(i)}
            disabled={done}
          >
            {selected.includes(i) ? '●' : '○'}
          </button>
        ))}
      </div>
      {done && (
        <div style={{ animation: 'bounceIn 0.5s', marginTop: 16 }}>
          <button
            className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`}
            onClick={() => {
              if (round < 2) setRound((r) => r + 1);
              else onNext();
            }}
          >
            {round < 2 ? 'Try Another →' : 'Next Station →'}
          </button>
        </div>
      )}
      <div className="round-label">Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

function Station3({ audioEnabled, onNext }) {
  const [round, setRound] = useState(0);
  // Re-derive divisor/quotient from round so each round presents a different question
  const divisor = getDivisorForRound(round, 2);
  const quotient = getQuotientForRound(round, 3); // cycles 2, 3, 4, 5
  const dividend = divisor * quotient;
  const [jumps, setJumps] = useState(0);
  const narRef = useRef(null);

  useEffect(() => {
    setJumps(0);
  }, [round]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation3Intro(), true);
    }
    return () => {
      narRef.current?.cancel();
    };
  }, [audioEnabled, round]);

  const handleJump = () => {
    if (jumps >= quotient) return;
    sounds.click();
    const next = jumps + 1;
    setJumps(next);
    if (next === quotient) {
      sounds.correct();
      narRef.current?.cancel();
      if (audioEnabled) {
        narRef.current = narrate(
          [celebrate(`${quotient} jumps of ${divisor} make ${dividend}!`)],
          true
        );
      }
    }
  };

  const done = jumps === quotient;

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header">
        <h2>📏 Skip Grouping</h2>
      </div>
      <p className="station-instruction">
        Jump by <strong className="text-gold">{divisor}</strong> on the number line. Each jump is one group!
      </p>
      <div className="numberline">
        {Array.from({ length: quotient + 1 }, (_, i) => (
          <div key={i} className="numberline-point">
            <div className={`nl-marker ${i > 0 && i <= jumps ? 'jumped' : ''}`}>{i * divisor}</div>
            {i < quotient && <div className={`nl-connector ${i < jumps ? 'active' : ''}`} />}
          </div>
        ))}
      </div>
      {!done && (
        <button className="btn btn-primary" onClick={handleJump} style={{ marginTop: 16 }}>
          Jump +{divisor} →
        </button>
      )}
      {done && (
        <div style={{ animation: 'bounceIn 0.5s', marginTop: 16 }}>
          <div className="equation-display">
            {dividend} ÷ {divisor} = {quotient}
          </div>
          <button
            className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`}
            onClick={() => {
              if (round < 2) setRound((r) => r + 1);
              else onNext();
            }}
          >
            {round < 2 ? 'Try Another →' : 'Next Station →'}
          </button>
        </div>
      )}
      <div className="round-label">Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

function Station4({ audioEnabled, onComplete }) {
  const [round, setRound] = useState(0);
  // Re-derive divisor/quotient from round so each round presents a different question
  const divisor = getDivisorForRound(round, 3);
  const quotient = getQuotientForRound(round, 3); // cycles 2, 3, 4, 5
  const dividend = divisor * quotient;
  const [inputVal, setInputVal] = useState('');
  const [done, setDone] = useState(false);
  const narRef = useRef(null);

  useEffect(() => {
    setInputVal('');
    setDone(false);
  }, [round]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation4Intro(), true);
    }
    return () => {
      narRef.current?.cancel();
    };
  }, [audioEnabled, round]);

  const handleNumClick = (n) => {
    if (done) return;
    const newVal = inputVal + n;
    setInputVal(newVal);
    sounds.click();
    if (parseInt(newVal, 10) === quotient) {
      setDone(true);
      sounds.correct();
      narRef.current?.cancel();
      if (audioEnabled) {
        narRef.current = narrate(
          [celebrate(`Yes! ${dividend} divided by ${divisor} equals ${quotient}!`)],
          true
        );
      }
    } else if (newVal.length >= String(quotient).length) {
      sounds.wrong();
      setTimeout(() => setInputVal(''), 500);
    }
  };

  const handleComplete = () => {
    narRef.current?.cancel();
    stopNarration();
    onComplete();
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header">
        <h2>📝 Division Sentence</h2>
      </div>
      <p className="station-instruction">Fill in the blank! Use the number pad.</p>
      <div className="division-sentence">
        <span>{dividend}</span>
        <span className="text-coral">÷</span>
        <span>{divisor}</span>
        <span className="text-gold">=</span>
        <div className={`sentence-blank ${done ? 'correct' : ''}`}>{inputVal || (done ? quotient : '?')}</div>
      </div>
      {!done && (
        <div className="numpad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
            <button key={n} className="btn btn-outline numpad-btn" onClick={() => handleNumClick(n)}>
              {n}
            </button>
          ))}
          <button className="btn btn-outline numpad-btn clear" onClick={() => setInputVal('')}>
            Clear
          </button>
        </div>
      )}
      {done && (
        <div style={{ marginTop: 24, animation: 'bounceIn 0.5s' }}>
          {round < 2 ? (
            <button className="btn btn-outline" onClick={() => setRound((r) => r + 1)}>
              Try Another →
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleComplete}>
              🎉 Complete Simulation!
            </button>
          )}
        </div>
      )}
      <div className="round-label">Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const nextStation = useCallback(() => {
    if (station < 3) setStation((s) => s + 1);
  }, [station]);

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h3 className="simulate-label">🧪 Simulate</h3>
        <p className="simulate-sublabel">Explore equal groups — no wrong answers!</p>
      </div>
      <div className="progress-dots">
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} />
            <span className="simulate-dot-label">{s.icon}</span>
          </div>
        ))}
      </div>
      <div className="glass-card simulate-card">
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 3 && <Station4 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>
    </div>
  );
}
