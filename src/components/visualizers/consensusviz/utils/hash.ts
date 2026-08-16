/**
 * Simple hash function for simulation purposes.
 * In a real blockchain, this would be SHA-256.
 */
export const generateHash = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to a positive hex string and pad with zeros
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  
  // Return a longer string to simulate a real hash
  return hex.repeat(4).substring(0, 32);
};

export const calculateBlockHash = (
  height: number,
  prevHash: string,
  timestamp: number,
  data: string,
  nonce: number
): string => {
  return generateHash(height + prevHash + timestamp + data + nonce);
};