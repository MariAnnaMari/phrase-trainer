import data from '../data/phrases';

export default function SectionPicker({ onSelect }) {
  return (
    <div>
      <h1 className="picker-title">Phrase Trainer</h1>
      <p className="picker-subtitle">choose a section to practice</p>

      {data.sections.map(section => (
        <div
          key={section.id}
          className="section-card"
          onClick={() => onSelect(section)}
        >
          <div>
            <div className="section-card-title">{section.title}</div>
            <div className="section-card-meta">{section.phrases.length} phrases</div>
          </div>
          <span className="section-card-arrow">→</span>
        </div>
      ))}
    </div>
  );
}
