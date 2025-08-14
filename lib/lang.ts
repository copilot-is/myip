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
  switch (lang?.toLowerCase()) {
    case 'en':
      return names?.en;
    case 'de':
      return names?.de || names?.en;
    case 'es':
      return names?.es || names?.en;
    case 'fr':
      return names?.fr || names?.en;
    case 'ja':
      return names?.ja || names?.en;
    case 'pt-br':
      return names?.['pt-BR'] || names?.en;
    case 'ru':
      return names?.ru || names?.en;
    case 'zh-cn':
      return names?.['zh-CN'] || names?.en;
    default:
      return names?.en;
  }
};
