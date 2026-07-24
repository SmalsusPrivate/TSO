import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveMediaUrl(val: string | number | undefined | null) {
  if (!val) return '/placeholder-image.png';
  if (typeof val === 'number' || !isNaN(Number(val))) {
    return `/api/media/${val}`;
  }
  return val.toString();
}
