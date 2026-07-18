import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export const generateCertificateNumber = (): string => {
  const date = format(new Date(), 'yyyyMMdd');
  const unique = uuidv4().split('-')[0].toUpperCase();
  return `AF-${date}-${unique}`;
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
