import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getOnboardingData, saveOnboardingData } from '../services/storageService';
import { OnboardingData } from '../types';
import { AuthContext } from './AuthContext';

interface OnboardingContextType {
  onboardingData: OnboardingData | null;
  completeOnboarding: (data: Partial<OnboardingData>) => void;
  updateName: (name: string) => void;
}

export const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(() => getOnboardingData());
  const auth = useContext(AuthContext);

  useEffect(() => {
    // This effect ensures that the onboarding state is in sync with the auth state.
    if (auth?.user) {
      // If a user is logged in, check if we have their onboarding data.
      const storedData = getOnboardingData();
      if (!storedData) {
          // If no data in storage, but we have it in state, clear state (edge case).
          if (onboardingData) setOnboardingData(null);
      } else if (!onboardingData || JSON.stringify(storedData) !== JSON.stringify(onboardingData)) {
          // If storage has data and it's different from state, update state.
          setOnboardingData(storedData);
      }
    } else {
      // If the user logs out, clear the onboarding state.
      if (onboardingData) {
        setOnboardingData(null);
      }
    }
  }, [auth?.user, onboardingData]);

  const completeOnboarding = (data: Partial<OnboardingData>) => {
    const finalData: OnboardingData = {
      isComplete: true,
      userName: data.userName || auth?.user?.name || 'Friend',
      language: data.language || 'en',
      locationAllowed: data.locationAllowed || false,
      goals: data.goals || [],
      topics: data.topics || [],
    };
    saveOnboardingData(finalData);
    setOnboardingData(finalData);
  };

  const updateName = (name: string) => {
    if (onboardingData) {
      const updatedData = { ...onboardingData, userName: name };
      saveOnboardingData(updatedData);
      setOnboardingData(updatedData);
    }
  };

  return (
    <OnboardingContext.Provider value={{ onboardingData, completeOnboarding, updateName }}>
      {children}
    </OnboardingContext.Provider>
  );
};
