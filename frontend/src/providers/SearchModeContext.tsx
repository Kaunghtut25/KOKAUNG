'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type SearchMode = 'flights' | 'buses';

interface SearchModeContextType {
  mode: SearchMode;
  setMode: (mode: SearchMode) => void;
}

const SearchModeContext = createContext<SearchModeContextType>({
  mode: 'flights',
  setMode: () => {},
});

export function useSearchMode() {
  return useContext(SearchModeContext);
}

export function SearchModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<SearchMode>('flights');

  // Read initial mode from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'buses') {
        setMode('buses');
      }
    }
  }, []);

  const setModeAndLog = useCallback((newMode: SearchMode) => {
    setMode(newMode);
    // Log to localStorage
    try {
      const events = JSON.parse(localStorage.getItem('a9_search_mode_events') || '[]');
      events.push({ mode: newMode, timestamp: new Date().toISOString() });
      if (events.length > 100) events.splice(0, events.length - 100);
      localStorage.setItem('a9_search_mode_events', JSON.stringify(events));
    } catch(e) {}
  }, []);

  return (
    <SearchModeContext.Provider value={{ mode, setMode: setModeAndLog }}>
      {children}
    </SearchModeContext.Provider>
  );
}
