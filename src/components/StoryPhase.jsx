import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, preloadNarration } from '../utils/audio';
import { getStoryNarration } from '../utils/narration';

const STORY_SLIDES = [
  {
    image: '/images/story_apples.png',
    title: "Leo's Apple Baskets",
    text: 'Leo picked 12 shiny apples from his garden. He wants to pack them into baskets with 3 apples in each basket. Leo wonders...',
    highlight: '"How many baskets do I need?"',
    mascotText: "Let's help Leo group his apples! 🍎",
  },
  {
    image: '/images/story_grouping.png',
    title: 'Making Equal Groups!',
    text: 'To find out, we make equal groups. We put 3 apples in each basket until all 12 apples are packed. This is called division as grouping!',
    highlight: '"12 divided by 3 equals 4 baskets!"',
    mascotText: 'Division means equal groups! 🧺',
  },
  {
    image: '/images/story_circles.png',
    title: 'The Grouping Secret',
    text: 'Leo drew circles to show his groups. Each circle is one basket with 3 apples inside. He counted the circles and found 4 groups. "When I know the group size, I count how many groups I can make!" he said.',
    highlight: '"Group size times number of groups equals the total!"',
    mascotText: 'Count the groups! ⭕',
  },
  {
    image: '/images/story_practice.png',
    title: "Let's Group Together!",
    text: 'Leo was so excited! He learned that division is the opposite of multiplication. "Can we practice more grouping?" he asked Emma.',
    highlight: '"Equal groups — here we come!"',
    mascotText: 'Your turn now! 🚀',
  },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);
  const narrationRef = useRef(null);
  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  useEffect(() => {
    if (audioEnabled) {
      preloadNarration(getStoryNarration(slide));
      if (slide + 1 < STORY_SLIDES.length) {
        preloadNarration(getStoryNarration(slide + 1));
      }
    }
  }, [slide, audioEnabled]);

  useEffect(() => {
    setTextVis(false);
    setHlVis(false);
    const t1 = setTimeout(() => setTextVis(true), 100);
    const t2 = setTimeout(() => setHlVis(true), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [slide]);

  useEffect(() => {
    if (textVis && audioEnabled) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(getStoryNarration(slide), true);
    }
    return () => {
      narrationRef.current?.cancel();
    };
  }, [textVis, slide, audioEnabled]);

  const goNext = useCallback(() => {
    if (anim) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => {
      if (isLast) onComplete();
      else setSlide((i) => i + 1);
      setAnim(false);
    }, 400);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => {
      setSlide((i) => i - 1);
      setAnim(false);
    }, 400);
  }, [anim, slide]);

  return (
    <div className="story-phase">
      <div className="story-progress">
        <div className="story-progress-bar">
          <div className="story-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="story-progress-label">
          {slide + 1} / {STORY_SLIDES.length}
        </span>
      </div>
      <div className={`story-card ${anim ? 'flipping' : ''}`}>
        <div className="story-image-section">
          <img src={s.image} alt={s.title} className="story-image" />
          <div className="story-image-overlay" />
        </div>
        <div className="story-text-section">
          <h2 className="story-title">{s.title}</h2>
          <p className={`story-text ${textVis ? 'revealed' : ''}`}>{s.text}</p>
          <div className={`story-highlight ${hlVis ? 'visible' : ''}`}>
            <span>✨</span>
            <span className="story-highlight-text">{s.highlight}</span>
            <span>✨</span>
          </div>
          <div className="story-mascot">
            <div className="mascot" style={{ width: 50, height: 50, fontSize: '1.4rem' }}>
              🦁
            </div>
            <div
              className="speech-bubble"
              style={{ fontSize: '0.8rem', padding: '8px 14px', maxWidth: 180 }}
            >
              {s.mascotText}
            </div>
          </div>
        </div>
      </div>
      <div className="story-nav">
        <button
          className="btn btn-outline btn-sm"
          onClick={goPrev}
          disabled={slide === 0}
          style={{ opacity: slide === 0 ? 0.3 : 1 }}
        >
          ← Back
        </button>
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (
            <div key={i} className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`} />
          ))}
        </div>
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-sm`} onClick={goNext}>
          {isLast ? "🚀 Let's Explore!" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
