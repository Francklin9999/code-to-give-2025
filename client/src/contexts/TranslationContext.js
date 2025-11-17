import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { translatePage, clearTranslationCache, getCurrentLanguage, setCurrentLanguage } from '../utils/translationService';
import { useLocation } from 'react-router-dom';

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [language, setLanguage] = useState('en'); // Default to English
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const languageRef = useRef('en');

  // Keep languageRef in sync with language state
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const performTranslation = useCallback(async (targetLang) => {
    if (targetLang === 'en') {
      clearTranslationCache();
      setCurrentLanguage('en');
      // Don't reload if already in English
      if (languageRef.current !== 'en') {
        window.location.reload();
      }
      return;
    }

    setIsTranslating(true);
    setTranslationProgress(0);
    
    try {
      await translatePage(targetLang, (progress) => {
        setTranslationProgress(progress);
      });
      setCurrentLanguage(targetLang);
    } catch (error) {
      console.error('Translation failed:', error);
      // Show user-friendly error
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
      notification.textContent = 'Translation failed. Please try again.';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 5000);
    } finally {
      setIsTranslating(false);
      setTranslationProgress(0);
    }
  }, []);

  // Load saved language preference on mount
  useEffect(() => {
    const savedLang = document.cookie
      .split(';')
      .find(c => c.trim().startsWith('athenapaths_lang='));
    
    if (savedLang) {
      const langCode = savedLang.split('=')[1];
      if (langCode && langCode !== 'en') {
        setLanguage(langCode);
        // Translate on initial load with a delay to ensure DOM is ready
        setTimeout(() => {
          performTranslation(langCode);
        }, 100);
      }
    }
    // If no saved language or saved language is English, we're already defaulting to English
  }, []); // Empty dependency array - only run on mount

  // Re-translate when navigating to a new page
  useEffect(() => {
    if (location.pathname !== previousPathRef.current) {
      previousPathRef.current = location.pathname;
      console.log('Page changed to:', location.pathname, 'Language:', language);
      
      if (language !== 'en' && !isTranslating) {
        console.log('Triggering translation for:', language);
        // Small delay to ensure DOM is ready after navigation
        const timer = setTimeout(() => {
          performTranslation(language);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, language, isTranslating, performTranslation]);

  const changeLanguage = useCallback(async (newLang) => {
    if (newLang === language) return;
    
    setLanguage(newLang);
    
    // Save preference
    document.cookie = `athenapaths_lang=${newLang};path=/;max-age=31536000`;
    
    await performTranslation(newLang);
  }, [language, performTranslation]);

  const value = {
    language,
    changeLanguage,
    isTranslating,
    translationProgress,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
