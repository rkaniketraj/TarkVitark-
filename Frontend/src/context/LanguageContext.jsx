import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [isTranslating, setIsTranslating] = useState(false);

  // Supported languages with flags
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
  ];

  // Translate text using Google Translate API
  const translateText = async (text, targetLang) => {
    if (!text.trim()) return text;

    // Create cache key
    const cacheKey = `translation_${targetLang}_${text}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;

    try {
      // Use Google Translate API
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      );

      if (!response.ok) throw new Error('Translation failed');

      const data = await response.json();
      const translatedText = data[0]?.map(item => item[0]).join('');

      // Cache translation
      if (translatedText) {
        localStorage.setItem(cacheKey, translatedText);
      }

      return translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on failure
    }
  };

  // Translate all text nodes on the page
  const translatePage = async (newLang) => {
    if (newLang === language) return;

    setIsTranslating(true);

    try {
      // Translate all translatable elements
      const translatableElements = document.querySelectorAll('[data-translate]');
      const translationPromises = [];

      translatableElements.forEach(el => {
        const originalText = el.textContent.trim();
        if (originalText) {
          translationPromises.push(
            translateText(originalText, newLang).then(translatedText => {
              if (translatedText && translatedText !== originalText) {
                el.textContent = translatedText;
              }
            })
          );
        }
      });

      await Promise.all(translationPromises);

      setLanguage(newLang);
      localStorage.setItem('language', newLang); // Persist language in localStorage
    } catch (error) {
      console.error('Page translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Apply the persisted language on page load
  useEffect(() => {
    translatePage(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: translatePage, 
      languages,
      isTranslating 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);