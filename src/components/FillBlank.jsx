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
  const blankData = makeBlanked(phrase.phrase, phrase.example);
  const blanked = blankData.text;
  const expectedAnswer = blankData.displayAnswer;

  const normalize = (s) => s.trim().toLowerCase();

  const isCorrect = blankData.acceptedAnswers.some(
      (answer) => normalize(answer) === normalize(input)
  );

  useEffect(() => {
    patchState({ [idxKey]: idx });
    setInput('');
    setSubmitted(false);
    setTimeout(() => inputRef.current?.focus(), 80);
  }, [idx, idxKey]);

  function handleSubmit() {
    if (!input.trim()) return;
    setSubmitted(true);
  }

  function goNext() {
    setIdx((i) => (i + 1) % phrases.length);
  }

  const [before, after] = blanked.includes('___')
      ? blanked.split('___')
      : [blanked, ''];

  return (
      <div>
        <div
            className="card"
            style={{ minHeight: 280, display: 'flex', flexDirection: 'column' }}
        >
          <div className="card-progress">
          <span>
            {idx + 1} / {phrases.length}
          </span>
            <div className="progress-bar">
              <div
                  className="progress-fill"
                  style={{ width: `${((idx + 1) / phrases.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="blank-sentence">
            "{before}
            <span className="blank-word">
            {submitted ? blankData.matched : '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'}
          </span>
            {after}"
          </div>

          <input
              ref={inputRef}
              className={`fill-input${submitted ? (isCorrect ? ' correct' : ' wrong') : ''}`}
              type="text"
              placeholder="Type the missing phrase…"
              value={input}
              disabled={submitted}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !submitted) handleSubmit();
              }}
          />

          {submitted && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <div className={`feedback-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                  {isCorrect ? '✓ Correct!' : `✗ Answer: "${expectedAnswer}"`}
                </div>
                <div className="card-definition">{phrase.definition}</div>
                <span className="card-translation">{phrase.translation}</span>
                <div className="audio-row" style={{ marginTop: 12 }}>
                  <AudioBtn text={phrase.phrase} label="phrase" />
                  <AudioBtn text={phrase.example} label="example" />
                </div>
              </div>
          )}

          <div className="nav-row" style={{ marginTop: 'auto', paddingTop: 16 }}>
            {!submitted ? (
                <button
                    className="btn btn-primary"
                    style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
                    onClick={handleSubmit}
                >
                  Check
                </button>
            ) : (
                <>
                  <button
                      className="btn btn-wide"
                      onClick={() => setIdx((i) => Math.max(0, i - 1))}
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