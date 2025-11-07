export interface PaginationControlMetadata {
  totalPagesArray: number[];
  totalPages: number;
  recordCount: number;
  fromCount: number;
  toCount: number;
}

export function createPaginationMetadata(
  totalPages: number = 0,
  recordCount: number = 0,
  fromCount: number = 0,
  toCount: number = 0
): PaginationControlMetadata {
  return {
    totalPagesArray: Array.from({ length: totalPages }, (_, i) => i + 1),
    totalPages,
    recordCount,
    fromCount,
    toCount,
  };
}
