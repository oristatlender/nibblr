// The app's memory. Everything the user does (answers, lessons finished, slips, photos)
// is kept in one object, saved on the device with AsyncStorage (localStorage on the web).
// No accounts or servers yet.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { allQuestions, lessons, ToolId } from './content/lessons';

const KEY = 'nibblr-state-v1';

export type DayStatus = 'free' | 'slip';

export type Slip = { date: string; when: string; place: string; trigger: string; change: string };

export type Photo = { date: string; uri: string };

export type Profile = {
  tried: string[];
  triedOther: string;
  triggers: string[];
  goalMin: number;
  reminder: string;
};

export type ReviewItem = { due: string; step: number }; // step indexes into REVIEW_GAPS

export type State = {
  onboarded: boolean;
  profile: Profile;
  startDate: string;
  dayOffset: number; // prototype only: lets the tester jump ahead a day
  completed: Record<string, string>; // lessonId -> date finished
  review: Record<string, ReviewItem>; // questionId -> when it comes back
  days: Record<string, DayStatus>;
  minutes: Record<string, number>;
  slips: Slip[];
  photos: Photo[];
  urgesSurfed: number;
  practiced: Record<string, string[]>; // date -> tools practiced that day
};

// Spaced review: a question returns 1 day later, then 3, 7 and 14 days later.
export const REVIEW_GAPS = [1, 3, 7, 14];
export const MAX_NEW_LESSONS_PER_DAY = 2;

const realToday = () => toKey(new Date());

export function toKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(key: string, n: number) {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + n);
  return toKey(date);
}

export function daysBetween(a: string, b: string) {
  const [y1, m1, d1] = a.split('-').map(Number);
  const [y2, m2, d2] = b.split('-').map(Number);
  const ms = new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime();
  return Math.round(ms / 86400000);
}

const fresh = (): State => ({
  onboarded: false,
  profile: { tried: [], triedOther: '', triggers: [], goalMin: 5, reminder: 'Evening' },
  startDate: realToday(),
  dayOffset: 0,
  completed: {},
  review: {},
  days: {},
  minutes: {},
  slips: [],
  photos: [],
  urgesSurfed: 0,
  practiced: {},
});

type Actions = {
  today: string;
  update: (fn: (s: State) => State) => void;
  finishOnboarding: (p: Profile) => void;
  completeLesson: (id: string, minutes: number) => void;
  answerReview: (qid: string, correct: boolean) => void;
  addMinutes: (n: number) => void;
  markDay: (status: DayStatus) => void;
  logSlip: (s: Omit<Slip, 'date'>) => void;
  practice: (tool: ToolId) => void;
  surfedUrge: () => void;
  addPhoto: (uri: string) => void;
  skipDay: () => void;
  resetAll: () => void;
};

type Store = { state: State; ready: boolean } & Actions;

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(fresh);
  const [ready, setReady] = useState(false);

  // Load saved progress once when the app opens.
  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setState({ ...fresh(), ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  // Save after every change.
  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const today = addDays(realToday(), state.dayOffset);

  const store = useMemo<Store>(() => {
    const update = (fn: (s: State) => State) => setState(fn);
    return {
      state,
      ready,
      today,
      update,
      finishOnboarding: (p) => update((s) => ({ ...s, profile: p, onboarded: true, startDate: today })),
      completeLesson: (id, minutes) =>
        update((s) => {
          if (s.completed[id]) return s;
          const lesson = lessons.find((l) => l.id === id);
          const review = { ...s.review };
          lesson?.quiz.forEach((q) => {
            review[q.id] = { due: addDays(today, REVIEW_GAPS[0]), step: 0 };
          });
          return {
            ...s,
            completed: { ...s.completed, [id]: today },
            review,
            minutes: { ...s.minutes, [today]: (s.minutes[today] ?? 0) + minutes },
          };
        }),
      answerReview: (qid, correct) =>
        update((s) => {
          const item = s.review[qid] ?? { due: today, step: 0 };
          const step = correct ? Math.min(item.step + 1, REVIEW_GAPS.length - 1) : 0;
          return { ...s, review: { ...s.review, [qid]: { due: addDays(today, REVIEW_GAPS[step]), step } } };
        }),
      addMinutes: (n) => update((s) => ({ ...s, minutes: { ...s.minutes, [today]: (s.minutes[today] ?? 0) + n } })),
      markDay: (status) => update((s) => ({ ...s, days: { ...s.days, [today]: status } })),
      logSlip: (slip) =>
        update((s) => ({
          ...s,
          slips: [...s.slips, { ...slip, date: today }],
          days: { ...s.days, [slip.when === 'Yesterday' ? addDays(today, -1) : today]: 'slip' },
        })),
      practice: (tool) =>
        update((s) => {
          const list = s.practiced[today] ?? [];
          return { ...s, practiced: { ...s.practiced, [today]: list.includes(tool) ? list : [...list, tool] } };
        }),
      surfedUrge: () => update((s) => ({ ...s, urgesSurfed: s.urgesSurfed + 1 })),
      addPhoto: (uri) => update((s) => ({ ...s, photos: [...s.photos, { date: today, uri }] })),
      skipDay: () => update((s) => ({ ...s, dayOffset: s.dayOffset + 1 })),
      resetAll: () => setState(fresh()),
    };
  }, [state, ready, today]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}

// ---- Derived facts the screens need ----

export function nextLesson(state: State, today: string) {
  const next = lessons.find((l) => !state.completed[l.id]);
  if (!next) return { lesson: null, available: false, doneToday: 0 };
  const doneToday = Object.values(state.completed).filter((d) => d === today).length;
  return { lesson: next, available: doneToday < MAX_NEW_LESSONS_PER_DAY, doneToday };
}

export function dueReview(state: State, today: string, max = 2) {
  return allQuestions.filter((q) => state.review[q.id] && state.review[q.id].due <= today).slice(0, max);
}

export function rollingScore(state: State, today: string) {
  let free = 0;
  for (let i = 0; i < 28; i++) if (state.days[addDays(today, -i)] === 'free') free++;
  return free;
}

export function last28(state: State, today: string) {
  return Array.from({ length: 28 }, (_, i) => {
    const key = addDays(today, i - 27);
    const beforeStart = daysBetween(state.startDate, key) < 0;
    return { key, status: state.days[key] ?? null, beforeStart, isToday: key === today };
  });
}

export function weekMinutes(state: State, today: string) {
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += state.minutes[addDays(today, -i)] ?? 0;
  return sum;
}

export function unlockedTools(state: State): Set<ToolId> {
  const set = new Set<ToolId>(['slip']);
  lessons.forEach((l) => {
    if (l.unlocks && state.completed[l.id]) set.add(l.unlocks);
  });
  return set;
}

export function prettyDate(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export function shortDate(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
