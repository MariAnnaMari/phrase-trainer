// ─── localStorage helpers ─────────────────────────────────────────────────────

import {IRREGULAR_MAP} from "./data/irregularMap.js";

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
  if (!phrase || !example) {
    return {
      text: example || '',
      matched: phrase || '',
      acceptedAnswers: phrase ? [phrase] : [],
      displayAnswer: phrase || ''
    };
  }

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


  const expandVariant = (base) => {
    const lower = base.toLowerCase().trim();
    const variants = new Set([base, lower]);

    if (IRREGULAR_MAP[lower]) {
      IRREGULAR_MAP[lower].forEach(v => variants.add(v));
    }

    const words = lower.split(' ');
    const first = words[0];
    const rest = words.slice(1).join(' ');

    if (words.length > 1) {
      variants.add(`${first}s ${rest}`);
      variants.add(`${first}ed ${rest}`);
      variants.add(`${first}ing ${rest}`);

      if (first.endsWith('e')) {
        variants.add(`${first.slice(0, -1)}ing ${rest}`);
      }
    } else {
      variants.add(`${lower}s`);
      variants.add(`${lower}ed`);
      variants.add(`${lower}ing`);

      if (lower.endsWith('e')) {
        variants.add(`${lower.slice(0, -1)}ing`);
      }
    }

    return [...variants];
  };

  const parts = phrase
      .split('/')
      .map(p => p.trim())
      .filter(Boolean);

  const acceptedSet = new Set();

  for (const part of parts.length ? parts : [phrase]) {
    expandVariant(part).forEach(v => acceptedSet.add(v));
  }

  acceptedSet.add(phrase);

  const acceptedAnswers = [...acceptedSet];
  const sorted = [...acceptedSet].sort((a, b) => b.length - a.length);

  for (const candidate of sorted) {
    const regex = new RegExp(`\\b${escapeRegExp(candidate)}\\b`, 'i');
    const match = example.match(regex);

    if (match) {
      return {
        text: example.replace(regex, '___'),
        matched: match[0],
        acceptedAnswers,
        displayAnswer: phrase
      };
    }
  }

  return {
    text: example,
    matched: phrase,
    acceptedAnswers,
    displayAnswer: phrase
  };
}