// A small home-made navigator: a stack of screens plus the three bottom tabs.
// It keeps the web build working from any web address, which Expo Router can't do
// on our hosted preview. We can switch to Expo Router before the App Store release.

import React, { createContext, useContext, useMemo, useState } from 'react';
import { ToolId } from './content/lessons';

export type Tab = 'today' | 'tools' | 'progress';

export type Route =
  | { name: 'tabs' }
  | { name: 'lesson'; id: string }
  | { name: 'review' }
  | { name: 'tool'; tool: ToolId; fromRescue?: boolean }
  | { name: 'rescue' }
  | { name: 'checkin' }
  | { name: 'settings' };

type Nav = {
  route: Route;
  tab: Tab;
  push: (r: Route) => void;
  replace: (r: Route) => void;
  back: () => void;
  home: (tab?: Tab) => void;
  setTab: (t: Tab) => void;
};

const Ctx = createContext<Nav | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: 'tabs' }]);
  const [tab, setTab] = useState<Tab>('today');

  const nav = useMemo<Nav>(
    () => ({
      route: stack[stack.length - 1],
      tab,
      push: (r) => setStack((s) => [...s, r]),
      replace: (r) => setStack((s) => [...s.slice(0, -1), r]),
      back: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
      home: (t) => {
        setStack([{ name: 'tabs' }]);
        if (t) setTab(t);
      },
      setTab,
    }),
    [stack, tab],
  );

  return <Ctx.Provider value={nav}>{children}</Ctx.Provider>;
}

export function useNav() {
  const n = useContext(Ctx);
  if (!n) throw new Error('useNav must be used inside NavProvider');
  return n;
}
