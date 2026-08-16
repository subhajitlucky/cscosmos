export const hexToUint8Array = (hex: string): Uint8Array => {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const match = cleanHex.match(/.{1,2}/g);
  if (!match) return new Uint8Array(0);
  return new Uint8Array(match.map(byte => parseInt(byte, 16)));
};

export const uint8ArrayToHex = (arr: Uint8Array): string => {
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
};

export const formatWord = (word: string): string => {
  const clean = word.startsWith('0x') ? word.slice(2) : word;
  if (clean.length <= 16) return '0x' + clean;
  return '0x' + clean.slice(0, 6) + '...' + clean.slice(-6);
};
