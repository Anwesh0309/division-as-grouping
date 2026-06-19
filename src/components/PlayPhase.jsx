import { useState, useCallback, useEffect, useRef } from 'react';
import { generateSessionQuestions } from '../utils/questionGenerator';
import { narrate, stopNarration, sounds } from '../utils/audio';
import {
  playWorldIntro,
  playReadQuestion,
  playCorrectNarration,
  playWrongNarration,
  playWorldComplete,
} from '../utils/narration';
import QuestionRenderer from './QuestionRenderer';

const WORLDS = [
  { id: 0, name: 'Apple Orchard', icon: '🍎', color: '#ff4081', desc: 'Questions 1–10' },
  { id: 1, name: 'Sticker Studio', icon: '⭐', color: '#4caf50', desc: 'Questions 11–20' },
  { id: 2, name: 'Toy Town', icon: '🧸', color: '#03a9f4', desc: 'Questions 21–30' },
  { id: 3, name: 'Puppy Park', icon: '🐶', color: '#00bcd4', desc: 'Questions 31–40' },
  { id: 4, name: 'Pencil Palace', icon: '✏️', color: '#ff5722', desc: 'Questions 41–50' },
  { id: 5, name: 'Group Galaxy', icon: '🚀', color: '#673ab7', desc: 'Questions 51–60' },
  { id: 6, name: 'Basket Bay', icon: '🧺', color: '#e91e63', desc: 'Questions 61–70' },
  { id: 7, name: 'Number Nest', icon: '🔢', color: '#9c27b0', desc: 'Questions 71–80' },
  { id: 8, name: 'Rainbow Groups', icon: '🌈', color: '#ffeb3b', desc: 'Questions 81–90' },
  { id: 9, name: 'Division Castle', icon: '🏰', color: '#ff9800', desc: 'Questions 91–100' },
];

function calcXP(streak) {
  return 10 + (streak >= 5 ? 5 : 0);
}

function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export default function PlayPhase({ onComplete, audioEnabled }) {
  const [currentWorld, setCurrentWorld] = useState(-1);
  const [worldResults, setWorldResults] = useState({});
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [worldComplete, setWorldComplete] = useState(false);
  const narrationRef = useRef(null);
  const [worldQuestions, setWorldQuestions] = useState([]);

  const q = worldQuestions[qIndex];

  useEffect(() => {
    if (audioEnabled && q && !worldComplete && !feedback && currentWorld >= 0) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(playReadQuestion(q.questionText), true);
      }, 300);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
      };
    }
  }, [qIndex, audioEnabled, q, worldComplete, feedback, currentWorld]);

  const startWorld = useCallback(
    (worldId) => {
      const bank = generateSessionQuestions();
      const filtered = bank.filter((item) => item.world === worldId);
      setWorldQuestions(filtered);
      setCurrentWorld(worldId);
      setQIndex(0);
      setScore(0);
      setStreak(0);
      setWorldComplete(false);
      setFeedback(null);
      setAnswered(false);
      narrationRef.current?.cancel();
      if (audioEnabled) {
        narrationRef.current = narrate(playWorldIntro(WORLDS[worldId].name), true);
      }
    },
    [audioEnabled]
  );

  const finishWorld = useCallback(() => {
    const w = WORLDS[currentWorld];
    const stars = calcStars(score, worldQuestions.length);
    sounds.badge();
    setWorldResults((prev) => ({
      ...prev,
      [currentWorld]: { score, total: worldQuestions.length, stars },
    }));
    setWorldComplete(true);
    narrationRef.current?.cancel();
    if (audioEnabled) {
      narrationRef.current = narrate(playWorldComplete(w.name, score, worldQuestions.length), true);
    }
  }, [currentWorld, score, audioEnabled, worldQuestions.length]);

  const backToMap = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    setCurrentWorld(-1);
    setWorldComplete(false);
    setFeedback(null);
  }, []);

  const handleAllComplete = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    const totalScore = Object.values(worldResults).reduce((a, r) => a + r.score, 0) + score;
    const totalQ =
      Object.values(worldResults).reduce((a, r) => a + r.total, 0) + (worldQuestions.length || 0);
    onComplete({
      score: totalScore,
      xp: totalXP,
      maxStreak,
      totalAnswered: totalQ,
      worldResults: {
        ...worldResults,
        [currentWorld]: {
          score,
          total: worldQuestions.length,
          stars: calcStars(score, worldQuestions.length),
        },
      },
    });
  }, [worldResults, score, totalXP, maxStreak, worldQuestions, currentWorld, onComplete]);

  const advance = useCallback(() => {
    setFeedback(null);
    setAnswered(false);
    if (qIndex + 1 < worldQuestions.length) {
      setQIndex((i) => i + 1);
    } else {
      finishWorld();
    }
  }, [qIndex, worldQuestions.length, finishWorld]);

  const handleAnswer = useCallback(
    (isCorrect) => {
      setAnswered(true);
      narrationRef.current?.cancel();
      if (isCorrect) {
        const ns = streak + 1;
        const earned = calcXP(ns);
        setScore((s) => s + 1);
        setStreak(ns);
        setMaxStreak((ms) => Math.max(ms, ns));
        setTotalXP((x) => x + earned);
        sounds.correct();
        if (ns >= 5 && ns % 5 === 0) sounds.streak();
        setXpPopup(`+${earned} XP`);
        setTimeout(() => setXpPopup(null), 1500);
        setFeedback({
          type: 'correct',
          message: ns >= 5 ? `🔥 ${ns} Streak!` : 'Correct! 🎉',
          sub: q.explanation,
        });
        if (audioEnabled) {
          narrationRef.current = narrate(playCorrectNarration(), true);
        }
        setTimeout(advance, 1800);
      } else {
        setStreak(0);
        sounds.wrong();
        setFeedback({ type: 'wrong', message: 'Not quite!', sub: q.explanation });
        if (audioEnabled) {
          narrationRef.current = narrate(playWrongNarration(), true);
        }
        setTimeout(advance, 2000);
      }
    },
    [streak, q, advance, audioEnabled]
  );

  if (currentWorld < 0) {
    const allDone = WORLDS.every((_, i) => worldResults[i]);
    return (
      <div className="play-phase">
        <div className="play-header">
          <h2 className="play-title">🎮 Play — Choose Your World!</h2>
          <p className="play-subtitle">Answer questions in each world. Earn stars and XP!</p>
          {totalXP > 0 && <div className="play-xp-badge">⭐ {totalXP} XP</div>}
        </div>
        <div className="world-map world-map-grid">
          {WORLDS.map((w, i) => {
            const unlocked = i === 0 || worldResults[i - 1];
            const completed = worldResults[i];
            return (
              <div
                key={w.id}
                className={`world-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
                onClick={() => unlocked && startWorld(i)}
                style={{ '--world-color': w.color }}
              >
                {!unlocked && <div className="world-lock">🔒</div>}
                <div className="world-icon">{w.icon}</div>
                <div className="world-name">{w.name}</div>
                <div className="world-desc">{w.desc}</div>
                {completed && (
                  <div className="world-stars">
                    {[1, 2, 3].map((s) => (
                      <span key={s} style={{ opacity: s <= completed.stars ? 1 : 0.2 }}>
                        ⭐
                      </span>
                    ))}
                    <span className="world-score">
                      {completed.score}/{completed.total}
                    </span>
                  </div>
                )}
                {unlocked && !completed && <div className="world-play-btn">▶ PLAY</div>}
              </div>
            );
          })}
        </div>
        {allDone && (
          <button className="btn btn-green btn-lg" onClick={handleAllComplete} style={{ marginTop: 24 }}>
            🏆 Complete Challenge!
          </button>
        )}
      </div>
    );
  }

  if (worldComplete) {
    const w = WORLDS[currentWorld];
    const stars = calcStars(score, worldQuestions.length);
    const isLastWorld = currentWorld === WORLDS.length - 1;
    return (
      <div className="play-phase">
        <div className="world-complete-card">
          <div className="world-complete-icon">{w.icon}</div>
          <h2 className="world-complete-title">{w.name} Complete!</h2>
          <div className="world-complete-score">
            {score}/{worldQuestions.length}
          </div>
          <div className="world-complete-stars">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`world-star ${s <= stars ? 'earned' : ''}`}
                style={{ animationDelay: `${s * 0.2}s` }}
              >
                ⭐
              </span>
            ))}
          </div>
          <div className="world-complete-xp">⭐ {totalXP} XP earned</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={backToMap}>
              ← World Map
            </button>
            {isLastWorld ? (
              <button className="btn btn-green" onClick={handleAllComplete}>
                🏆 Finish!
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setWorldResults((prev) => ({
                    ...prev,
                    [currentWorld]: { score, total: worldQuestions.length, stars },
                  }));
                  startWorld(currentWorld + 1);
                }}
              >
                Next World →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!q) return null;
  const w = WORLDS[currentWorld];
  const pct = Math.round((qIndex / worldQuestions.length) * 100);

  return (
    <div className="play-phase">
      <div className="play-world-badge" style={{ background: w.color }}>
        {w.icon} {w.name}
      </div>
      <div className="hud">
        <div className="hud-item">⭐ {totalXP}</div>
        <div className={`hud-item ${streak >= 5 ? 'streak-fire' : ''}`}>🔥 {streak}x</div>
      </div>
      <div style={{ width: '100%', maxWidth: 700, marginBottom: 16 }}>
        <div className="progress-bar-container">
          <div className="progress-bar-label">
            <span>
              Question {qIndex + 1}/{worldQuestions.length}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <div className="question-card">
        <QuestionRenderer question={q} onAnswer={handleAnswer} disabled={answered} />
      </div>
      {xpPopup && <div className="xp-popup">{xpPopup}</div>}
      {feedback && (
        <div className="feedback-overlay">
          <div className={`feedback-content ${feedback.type}`}>
            <div className="feedback-emoji">{feedback.type === 'correct' ? '🎉' : '😢'}</div>
            <div className="feedback-message">{feedback.message}</div>
            <div className="feedback-sub">{feedback.sub}</div>
          </div>
        </div>
      )}
    </div>
  );
}
