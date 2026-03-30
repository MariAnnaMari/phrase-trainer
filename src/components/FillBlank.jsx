import { useState, useEffect, useRef } from 'react';
import AudioBtn from './AudioBtn';
import { makeBlanked, loadState, patchState } from '../utils';

export default function FillBlank({ phrases, sectionId }) {
  const idxKey = `fill_idx_${sectionId}`;

  const [idx, setIdx] = useState(() => loadState()[idxKey] || 0);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  const phrase = phrases[idx];
  const blanked = makeBlanked(phrase.phrase, phrase.example);
  const isCorrect = input.trim().toLowerCase() === phrase.phrase.toLowerCase();

  // Reset state and focus when phrase changes
  useEffect(() => {
    patchState({ [idxKey]: idx });
    setInput('');
    setSubmitted(false);
    setTimeout(() => inputRef.current?.focus(), 80);
  }, [idx]);

  function handleSubmit() {
    if (!input.trim()) return;
    setSubmitted(true);
  }

  function goNext() {
    setIdx(i => (i + 1) % phrases.length);
  }

  // Split the blanked sentence around "___" to render styled gap
  const [before, after] = blanked.split('___');

  return (
    <div>
      <div className="card" style={{ minHeight: 280, display: 'flex', flexDirection: 'column' }}>
        {/* Progress */}
        <div className="card-progress">
          <span>{idx + 1} / {phrases.length}</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((idx + 1) / phrases.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Sentence with gap */}
        <div className="blank-sentence">
          "{before}
          <span className="blank-word">
            {submitted ? phrase.phrase : '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'}
          </span>
          {after}"
        </div>

        {/* Answer input */}
        <input
          ref={inputRef}
          className={`fill-input${submitted ? (isCorrect ? ' correct' : ' wrong') : ''}`}
          type="text"
          placeholder="Type the missing phrase…"
          value={input}
          disabled={submitted}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !submitted) handleSubmit(); }}
        />

        {/* Post-submit result */}
        {submitted && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <div className={`feedback-badge ${isCorrect ? 'correct' : 'wrong'}`}>
              {isCorrect ? '✓ Correct!' : `✗ Answer: "${phrase.phrase}"`}
            </div>
            <div className="card-definition">{phrase.definition}</div>
            <span className="card-translation">{phrase.translation}</span>
            <div className="audio-row" style={{ marginTop: 12 }}>
              <AudioBtn text={phrase.phrase} label="phrase" />
              <AudioBtn text={phrase.example} label="example" />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="nav-row" style={{ marginTop: 'auto', paddingTop: 16 }}>
          {!submitted ? (
            <button className="btn btn-primary btn-wide" onClick={handleSubmit}>
              Check
            </button>
          ) : (
            <>
              <button
                className="btn btn-wide"
                onClick={() => setIdx(i => Math.max(0, i - 1))}
                disabled={idx === 0}
              >
                ← prev
              </button>
              <button className="btn btn-primary btn-wide" onClick={goNext}>
                {idx === phrases.length - 1 ? 'restart' : 'next →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
