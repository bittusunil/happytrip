import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';

interface TranslationStrings {
  [key: string]: any;
}

export const useTranslation = () => {
  const { user } = useAuthStore();
  const language = user?.language || 'en';

  const loadTranslations = useCallback(
    async (lang: string): Promise<TranslationStrings> => {
      try {
        const response = await import(
          `../../public/locales/${lang}/common.json`
        );
        return response.default;
      } catch (error) {
        console.warn(`Failed to load translations for ${lang}, falling back to English`);
        const response = await import(`../../public/locales/en/common.json`);
        return response.default;
      }
    },
    [],
  );

  const t = useCallback(
    (key: string, defaultValue?: string): string => {
      const keys = key.split('.');
      let value: any = null;

      // Try to load from localStorage cache
      const cached = localStorage.getItem(`translations_${language}`);
      if (cached) {
        try {
          const translations = JSON.parse(cached);
          value = keys.reduce((obj, k) => obj?.[k], translations);
        } catch (error) {
          console.warn('Failed to parse cached translations');
        }
      }

      return value || defaultValue || key;
    },
    [language],
  );

  const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'pl', name: 'Polski' },
    { code: 'cs', name: 'Čeština' },
    { code: 'hu', name: 'Magyar' },
    { code: 'ro', name: 'Română' },
    { code: 'sv', name: 'Svenska' },
    { code: 'no', name: 'Norsk' },
    { code: 'da', name: 'Dansk' },
  ];

  return {
    t,
    language,
    loadTranslations,
    supportedLanguages,
  };
};
