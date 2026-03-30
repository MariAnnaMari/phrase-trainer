// ─── localStorage helpers ─────────────────────────────────────────────────────

const LS_KEY = 'phrase_trainer_v1';

export function loadState() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveState(obj) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(obj));
  } catch {}
}

export function patchState(patch) {
  saveState({ ...loadState(), ...patch });
}

// ─── Speech ──────────────────────────────────────────────────────────────────

export function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-US';
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
}

// ─── Fill-in-the-blank helper ─────────────────────────────────────────────────

export function makeBlanked(phrase, example) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return example.replace(new RegExp(escaped, 'i'), '___');
}
