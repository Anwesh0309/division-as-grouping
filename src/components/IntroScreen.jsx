import { useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { introNarration } from '../utils/narration';

const JOURNEY_PHASES = [
  { icon: '🔮', label: 'Wonder', desc: 'A grouping mystery!' },
  { icon: '📖', label: 'Story', desc: 'See division in action' },
  { icon: '🧪', label: 'Simulate', desc: '4 interactive labs' },
  { icon: '🎮', label: 'Play', desc: '100 challenges' },
  { icon: '📝', label: 'Reflect', desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart, audioEnabled }) {
  const narrationRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(introNarration(), true);
      }, 200);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
        stopNarration();
      };
    }
  }, [audioEnabled]);

  const handleStart = () => {
    narrationRef.current?.cancel();
    stopNarration();
    onStart();
  };

  return (
    <div className="intro-screen">
      <div className="intro-badge">✨ Singapore MOE Curriculum · Grade 2</div>

      <h1 className="intro-title">
        <span style={{ color: 'var(--coral)' }}>Division</span> as{' '}
        <span style={{ color: 'var(--gold)' }}>Grouping</span>
      </h1>
      <p className="intro-subtitle">DivideQuest · Equal Groups Adventure</p>

      <div className="mascot-container">
        <div className="mascot">🦁</div>
        <div className="speech-bubble">Hi! I&apos;m Leo. Ready to group? 🧺</div>
      </div>

      <p className="intro-desc">
        Learn to split numbers into <strong style={{ color: 'var(--gold)' }}>equal groups</strong>, connect
        division to multiplication, and master facts for ÷2, ÷3, ÷4, ÷5, and ÷10!
      </p>

      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStart}>
        🚀 Begin Your Journey!
      </button>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🎯</div>
          <div className="feature-card-label">100 Questions</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🧺</div>
          <div className="feature-card-label">Equal Groups</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">✨</div>
          <div className="feature-card-label">Badges & XP</div>
        </div>
      </div>
    </div>
  );
}
