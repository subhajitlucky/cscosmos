// Real Cryptography via Web Crypto API
// We use ECDSA (P-256) for Signatures to ensure the "Verification" is mathematically real.
// This allows the "Tamper Detection" to work 100% correctly without hacking state.

export const sha256 = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return bufferToHex(hashBuffer);
};

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): ArrayBuffer {
  const tokens = hex.match(/.{1,2}/g);
  if (!tokens) return new ArrayBuffer(0);
  return new Uint8Array(tokens.map(byte => parseInt(byte, 16))).buffer;
}

export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  publicKeyHex: string; // For display
  privateKeyHex: string; // For display
}

export const generateKeyPair = async (): Promise<KeyPair> => {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"]
  );

  const pubExport = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privExport = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    publicKeyHex: bufferToHex(pubExport).slice(-64), // Show last 64 chars for brevity/aesthetics
    privateKeyHex: bufferToHex(privExport).slice(-64) 
  };
};

export const signMessage = async (message: string, privateKey: CryptoKey): Promise<string> => {
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    privateKey,
    enc.encode(message)
  );
  return bufferToHex(signature);
};

export const verifySignature = async (message: string, signatureHex: string, publicKey: CryptoKey): Promise<boolean> => {
  try {
    const enc = new TextEncoder();
    const result = await crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      publicKey,
      hexToBuffer(signatureHex),
      enc.encode(message)
    );
    return result;
  } catch (e) {
    console.error("Verification error:", e);
    return false;
  }
};