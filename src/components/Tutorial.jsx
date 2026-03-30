import { useState } from 'react';
import AudioBtn from './AudioBtn';

// A single phrase row in the list
function PhraseRow({ phrase }) {
  const [showTranslation, setShowTranslation] = useState(true);

  return (
    <div className="card">
      <div className="tutorial-card-phrase">{phrase.phrase}</div>
      <div className="tutorial-card-definition">{phrase.definition}</div>
      <div className="tutorial-card-example">"{phrase.example}"</div>

      <div className="tutorial-card-footer">
        {/* Clickable hidden translation — click to reveal if hidden */}
        <span
          className={`card-translation${showTranslation ? '' : ' hidden'}`}
          onClick={() => !showTranslation && setShowTranslation(true)}
        >
          {phrase.translation}
        </span>

        <button className="toggle-btn" onClick={() => setShowTranslation(v => !v)}>
          {showTranslation ? 'hide' : 'show translation'}
        </button>

        <div className="audio-row" style={{ marginLeft: 'auto' }}>
          <AudioBtn text={phrase.phrase} label="phrase" />
          <AudioBtn text={phrase.example} label="example" />
        </div>
      </div>
    </div>
  );
}

export default function Tutorial({ phrases }) {
  return (
    <div className="tutorial-list">
      {phrases.map(phrase => (
        <PhraseRow key={phrase.id} phrase={phrase} />
      ))}
    </div>
  );
}
