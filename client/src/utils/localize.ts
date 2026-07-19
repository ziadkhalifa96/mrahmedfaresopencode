import i18n from '../i18n';

export function localize(obj: Record<string, any>, field?: string): string {
  const lang = i18n.language as 'en' | 'ar';

  if (field) {
    const langSuffix = lang === 'ar' ? 'Ar' : 'En';
    const fallbackSuffix = lang === 'ar' ? 'En' : 'Ar';

    if (obj[`${field}${langSuffix}`]) return obj[`${field}${langSuffix}`];
    if (obj[field]) return obj[field];
    if (obj[`${field}${fallbackSuffix}`]) return obj[`${field}${fallbackSuffix}`];
    return '';
  }

  if (obj[lang]) return obj[lang];
  if (obj[lang === 'ar' ? 'en' : 'ar']) return obj[lang === 'ar' ? 'en' : 'ar'];
  return '';
}
