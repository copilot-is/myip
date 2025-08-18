export const CHINA = {
  names: {
    de: 'China',
    en: 'China',
    es: 'China',
    fr: 'Chine',
    ja: '中国',
    'pt-BR': 'China',
    ru: 'Китай',
    'zh-CN': '中国'
  }
};

export const isSupportedLanguage = (lang?: string) => {
  if (!lang) {
    return false;
  }

  const supportedLanguages = [
    'en',
    'de',
    'es',
    'fr',
    'ja',
    'ru',
    'pt-BR',
    'zh-CN'
  ];

  return supportedLanguages.includes(lang);
};

export const getNameByLang = (
  names?: {
    de?: string;
    en: string;
    es?: string;
    fr?: string;
    ja?: string;
    'pt-BR'?: string;
    ru?: string;
    'zh-CN'?: string;
  },
  lang?: string
): string | undefined => {
  const langMap: Record<string, string | undefined> = {
    en: names?.en,
    de: names?.de,
    es: names?.es,
    fr: names?.fr,
    ja: names?.ja,
    ru: names?.ru,
    'pt-BR': names?.['pt-BR'],
    'zh-CN': names?.['zh-CN']
  };

  return langMap[lang || 'en'] || names?.en;
};
