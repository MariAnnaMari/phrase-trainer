import { useState } from 'react';
import Tutorial from './Tutorial';
import Flashcards from './Flashcards';
import FillBlank from './FillBlank';
import { loadState, patchState } from '../utils';

const MODES = [
  { id: 'tutorial',   label: 'Tutorial',      dot: 'var(--accent)' },
  { id: 'flashcards', label: 'Flashcards',     dot: 'var(--yellow)' },
  { id: 'fill',       label: 'Fill in blank',  dot: 'var(--accent-warm)' },
];

export default function SectionView({ section, onBack }) {
  const modeKey = `mode_${section.id}`;
  const [mode, setMode] = useState(() => loadState()[modeKey] || 'tutorial');

  function switchMode(m) {
    setMode(m);
    patchState({ [modeKey]: m });
  }

  return (
    <div>
      {/* Header */}
      <div className="header">
        <button className="header-back" onClick={onBack}>← back</button>
        <span className="header-title">{section.title}</span>
        <span className="header-count">{section.phrases.length} phrases</span>
      </div>

      {/* Mode selector */}
      <div className="mode-tabs">
        {MODES.map(m => (
          <button
            key={m.id}
            className={`mode-tab${mode === m.id ? ' active' : ''}`}
            onClick={() => switchMode(m.id)}
          >
            <span className="tab-dot" style={{ background: m.dot }} />
            {m.label}
          </button>
        ))}
      </div>

      {/* Active mode */}
      {mode === 'tutorial'   && <Tutorial   phrases={section.phrases} sectionId={section.id} />}
      {mode === 'flashcards' && <Flashcards phrases={section.phrases} sectionId={section.id} />}
      {mode === 'fill'       && <FillBlank  phrases={section.phrases} sectionId={section.id} />}
    </div>
  );
}
