export interface TranslationResult {
  virtualAddress: number;
  pageSize: number;
  pageNumber: number;
  offset: number;
  frame: number | null;
  physicalAddress: number | null;
  fault: boolean;
}

export function translateAddress(
  virtualAddress: number,
  pageSize: number,
  pageTable: number[],
): TranslationResult {
  const size = Math.max(1, Math.floor(pageSize));
  const address = Math.max(0, Math.floor(virtualAddress));
  const pageNumber = Math.floor(address / size);
  const offset = address % size;
  const frame = pageTable[pageNumber];

  if (frame === undefined || frame < 0) {
    return {
      virtualAddress: address,
      pageSize: size,
      pageNumber,
      offset,
      frame: null,
      physicalAddress: null,
      fault: true,
    };
  }

  return {
    virtualAddress: address,
    pageSize: size,
    pageNumber,
    offset,
    frame,
    physicalAddress: frame * size + offset,
    fault: false,
  };
}

export function toHex(value: number): string {
  return `0x${Math.max(0, Math.floor(value)).toString(16).toUpperCase()}`;
}

export function pageOffsetBits(pageSize: number): number {
  return Math.round(Math.log2(Math.max(1, pageSize)));
}
