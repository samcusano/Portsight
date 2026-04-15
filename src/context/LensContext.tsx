import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { LENSES, DEFAULT_LENS } from '../data/lenses';
import type { LensId, LensConfig } from '../data/lenses';

interface LensContextValue {
  activeLensId: LensId;
  setActiveLensId: (id: LensId) => void;
  activeLens: LensConfig;
}

const LensContext = createContext<LensContextValue | null>(null);

export function LensProvider({ children }: { children: ReactNode }) {
  const [activeLensId, setActiveLensId] = useState<LensId>(DEFAULT_LENS.id);

  const activeLens = LENSES.find(l => l.id === activeLensId) ?? DEFAULT_LENS;

  return (
    <LensContext.Provider value={{ activeLensId, setActiveLensId, activeLens }}>
      {children}
    </LensContext.Provider>
  );
}

export function useLens(): LensContextValue {
  const ctx = useContext(LensContext);
  if (!ctx) throw new Error('useLens must be used within LensProvider');
  return ctx;
}
