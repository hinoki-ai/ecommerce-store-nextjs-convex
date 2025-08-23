// Date Utilities - Date manipulation and formatting functions
import { Timestamp } from '../../domain/types';

export function formatDate(date: Timestamp | Date, locale: string = 'en-US'): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Timestamp | Date, locale: string = 'en-US'): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatTime(date: Timestamp | Date, locale: string = 'en-US'): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelativeTime(date: Timestamp | Date, locale: string = 'en-US'): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInDays > 0) return rtf.format(-diffInDays, 'day');
  if (diffInHours > 0) return rtf.format(-diffInHours, 'hour');
  if (diffInMinutes > 0) return rtf.format(-diffInMinutes, 'minute');
  if (diffInSeconds > 10) return rtf.format(-diffInSeconds, 'second');

  return 'just now';
}

export function isToday(date: Timestamp | Date): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

export function isYesterday(date: Timestamp | Date): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
}

export function isThisWeek(date: Timestamp | Date): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));

  return d >= weekStart && d <= weekEnd;
}

export function isThisMonth(date: Timestamp | Date): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function isThisYear(date: Timestamp | Date): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  return d.getFullYear() === now.getFullYear();
}

export function addDays(date: Timestamp | Date, days: number): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addHours(date: Timestamp | Date, hours: number): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
}

export function addMinutes(date: Timestamp | Date, minutes: number): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

export function addSeconds(date: Timestamp | Date, seconds: number): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setSeconds(d.getSeconds() + seconds);
  return d;
}

export function startOfDay(date: Timestamp | Date): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Timestamp | Date): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function startOfWeek(date: Timestamp | Date): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  d.setDate(diff);
  return startOfDay(d);
}

export function endOfWeek(date: Timestamp | Date): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7); // Adjust for Sunday
  d.setDate(diff);
  return endOfDay(d);
}

export function startOfMonth(date: Timestamp | Date): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setDate(1);
  return startOfDay(d);
}

export function endOfMonth(date: Timestamp | Date): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setMonth(d.getMonth() + 1, 0);
  return endOfDay(d);
}

export function getDaysInMonth(date: Timestamp | Date): number {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export function getDayOfWeek(date: Timestamp | Date): number {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  return d.getDay(); // 0 = Sunday, 1 = Monday, etc.
}

export function getWeekOfYear(date: Timestamp | Date): number {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - startOfYear.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil((diff + 1) / oneWeek);
}

export function isWeekend(date: Timestamp | Date): boolean {
  const dayOfWeek = getDayOfWeek(date);
  return dayOfWeek === 0 || dayOfWeek === 6;
}

export function isWeekday(date: Timestamp | Date): boolean {
  return !isWeekend(date);
}

export function getAge(date: Timestamp | Date): number {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const monthDiff = now.getMonth() - d.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < d.getDate())) {
    age--;
  }

  return age;
}

export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export function parseISO(dateString: string): Date | null {
  const date = new Date(dateString);
  return isValidDate(date) ? date : null;
}

export function toISOString(date: Timestamp | Date): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toISOString();
}

export function fromISOString(dateString: string): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isValidDate(date) ? date : null;
}