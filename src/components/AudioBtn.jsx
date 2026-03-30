import { speak } from '../utils';

// Play icon SVG inline — no external deps needed
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export default function AudioBtn({ text, label }) {
  return (
    <button
      className="btn-audio"
      onClick={() => speak(text)}
      title={`Play: ${text}`}
    >
      <PlayIcon />
      {label}
    </button>
  );
}
