'use client';

import React, { createContext, useContext } from 'react';

export const ContentContext = createContext<Record<string, string>>({});

export const useContent = () => useContext(ContentContext);

export function ContentProvider({ content, children }: { content: Record<string, string>; children: React.ReactNode }) {
  return (
    <ContentContext.Provider value={content || {}}>
      {children}
    </ContentContext.Provider>
  );
}
