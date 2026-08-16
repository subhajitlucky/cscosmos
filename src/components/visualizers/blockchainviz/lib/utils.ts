import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import SHA256 from "crypto-js/sha256";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashData(data: string | object): string {
  const stringToHash = typeof data === 'string' ? data : JSON.stringify(data);
  return SHA256(stringToHash).toString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
