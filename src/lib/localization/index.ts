import { messages } from './en-US.json';

export function i18n(key: string, ...params: unknown[]): string {
  const message = (messages as Record<string, string>)[key] || key;
  return params.reduce((acc: string, current, index) => acc.replace(new RegExp(`\\{${index}\\}`, 'g'), String(current)), message)
}