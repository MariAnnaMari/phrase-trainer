import { useState, useEffect } from 'react';
import AudioBtn from './AudioBtn';
import { loadState, patchState } from '../utils';

export default function Flashcards({ phrases, sectionId }) {
  const queueKey = `flash_queue_${sectionId}`;

  // Restore queue from localStorage or build fresh from phrase ids
  const [queue, setQueue] = useState(() => {
    const saved = loadState()[queueKey];
    return saved || phrases.map(p => p.id);
  });
  const [revealed, setRevealed] = useState(false);

  // Track how many unique phrases the user has seen this session
  const [seen, setSeen] = useState(new Set());

  const currentPhrase = phrases.find(p => p.id === queue[0]);

  // Persist queue whenever it changes
  useEffect(() => {
    patchState({ [queueKey]: queue });
  }, [queue]);

  // Mark current phrase as seen
  useEffect(() => {
    if (currentPhrase) {
      setSeen(prev => new Set([...prev, currentPhrase.id]));
    }
  }, [currentPhrase?.id]);

  function handleRating(rating) {
    setRevealed(false);
    setQueue(prev => {
      const [current, ...rest] = prev;
      if (rating === 'knew') {
        // Goes to the very end
        return [...rest, current];
      }
      if (rating === 'almost') {
        // Goes ~60% into the remaining queue
        const pos = Math.max(1, Math.floor(rest.length * 0.6));
        return [...rest.slice(0, pos), current, ...rest.slice(pos)];
      }
      // "didn't know" — repeat soon (within next 3 cards)
      const pos = Math.min(3, rest.length);
      return [...rest.slice(0, pos), current, ...rest.slice(pos)];
    });
  }

  function restart() {
    const fresh = phrases.map(p => p.id);
    setQueue(fresh);
    setSeen(new Set());
    setRevealed(false);
    patchState({ [queueKey]: fresh });
  }

  // All phrases shown at least once → show "round complete"
  if (seen.size === phrases.length && !currentPhrase) {
    return (
      <div className="card done-screen">
        <h2>Round complete! 🎉</h2>
        <p>You reviewed all {phrases.length} phrases.</p>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={restart}>
          Start over
        </button>
      </div>
    );
  }

  if (!currentPhrase) return null;

  return (
    <div>
      <div className="card" style={{ minHeight: 280, display: 'flex', flexDirection: 'column' }}>
        {/* Progress */}
        <div className="card-progress">
          <span>{seen.size} / {phrases.length} seen</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(seen.size / phrases.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Definition is the prompt */}
        <div className="card-definition" style={{ fontSize: 16, color: 'var(--ink)' }}>
          {currentPhrase.definition}
        </div>

        {!revealed ? (
          <button
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
            onClick={() => setRevealed(true)}
          >
            Show answer
          </button>
        ) : (
          <div className="reveal-section">
            <div className="card-phrase">{currentPhrase.phrase}</div>
            <div className="card-example">"{currentPhrase.example}"</div>
            <span className="card-translation">{currentPhrase.translation}</span>

            <div className="audio-row" style={{ marginTop: 16 }}>
              <AudioBtn text={currentPhrase.phrase} label="phrase" />
              <AudioBtn text={currentPhrase.example} label="example" />
            </div>

            <div className="rating-row">
              <button className="btn-rating didnt" onClick={() => handleRating('didnt')}>
                ✗ didn't know
              </button>
              <button className="btn-rating almost" onClick={() => handleRating('almost')}>
                ~ almost
              </button>
              <button className="btn-rating knew" onClick={() => handleRating('knew')}>
                ✓ knew it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
