"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HelpContextType {
  // Tutorial state
  isTutorialOpen: boolean;
  currentTutorial: string | null;
  openTutorial: (tutorialId: string) => void;
  closeTutorial: () => void;
  
  // Help system state
  isHelpOpen: boolean;
  helpInitialTab: string;
  openHelp: (initialTab?: string) => void;
  closeHelp: () => void;
  
  // First-time user state
  isFirstTimeUser: boolean;
  setFirstTimeUser: (value: boolean) => void;
  
  // Contextual help
  showContextualHelp: (context: string) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

interface HelpProviderProps {
  children: ReactNode;
}

export function HelpProvider({ children }: HelpProviderProps) {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpInitialTab, setHelpInitialTab] = useState('faq');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  const openTutorial = (tutorialId: string) => {
    setCurrentTutorial(tutorialId);
    setIsTutorialOpen(true);
    setIsHelpOpen(false); // Close help if open
  };

  const closeTutorial = () => {
    setIsTutorialOpen(false);
    setCurrentTutorial(null);
  };

  const openHelp = (initialTab: string = 'faq') => {
    setHelpInitialTab(initialTab);
    setIsHelpOpen(true);
    setIsTutorialOpen(false); // Close tutorial if open
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
  };

  const showContextualHelp = (context: string) => {
    // Map contexts to specific help sections or tutorials
    const contextMap: Record<string, { type: 'help' | 'tutorial'; target: string; tab?: string }> = {
      'upload': { type: 'tutorial', target: 'fingerprint-upload' },
      'analysis': { type: 'tutorial', target: 'analysis-process' },
      'dashboard': { type: 'help', target: 'guides', tab: 'guides' },
      'getting-started': { type: 'tutorial', target: 'getting-started' },
      'troubleshooting': { type: 'help', target: 'faq', tab: 'faq' },
      'security': { type: 'help', target: 'guides', tab: 'guides' }
    };

    const mapping = contextMap[context];
    if (mapping) {
      if (mapping.type === 'tutorial') {
        openTutorial(mapping.target);
      } else {
        openHelp(mapping.tab || 'faq');
      }
    } else {
      // Default to general help
      openHelp('faq');
    }
  };

  const value: HelpContextType = {
    isTutorialOpen,
    currentTutorial,
    openTutorial,
    closeTutorial,
    isHelpOpen,
    helpInitialTab,
    openHelp,
    closeHelp,
    isFirstTimeUser,
    setFirstTimeUser: setIsFirstTimeUser,
    showContextualHelp
  };

  return (
    <HelpContext.Provider value={value}>
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp() {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
}

export default HelpContext; 