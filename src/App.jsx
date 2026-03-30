import { useState } from 'react';
import SectionPicker from './components/SectionPicker';
import SectionView from './components/SectionView';
import data from './data/phrases';
import { loadState, patchState } from './utils';

export default function App() {
  // Restore last open section from localStorage
  const [section, setSection] = useState(() => {
    const lastId = loadState().lastSection;
    return lastId ? data.sections.find(s => s.id === lastId) || null : null;
  });

  function selectSection(s) {
    setSection(s);
    patchState({ lastSection: s.id });
  }

  function goBack() {
    setSection(null);
    patchState({ lastSection: null });
  }

  return (
    <div className="app">
      {section
        ? <SectionView section={section} onBack={goBack} />
        : <SectionPicker onSelect={selectSection} />
      }
    </div>
  );
}
