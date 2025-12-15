export interface SizeChart {
  size: string;
  bust: { cm: number; in: number };
  waist: { cm: number; in: number };
  hip: { cm: number; in: number };
}

export const SIZE_CHART: SizeChart[] = [
  { size: 'XXS', bust: { cm: 76, in: 30 }, waist: { cm: 61, in: 24 }, hip: { cm: 86, in: 34 } },
  { size: 'XS', bust: { cm: 81, in: 32 }, waist: { cm: 66, in: 26 }, hip: { cm: 91, in: 36 } },
  { size: 'S', bust: { cm: 86, in: 34 }, waist: { cm: 71, in: 28 }, hip: { cm: 97, in: 38 } },
  { size: 'M', bust: { cm: 91, in: 36 }, waist: { cm: 76, in: 30 }, hip: { cm: 102, in: 40 } },
  { size: 'L', bust: { cm: 97, in: 38 }, waist: { cm: 81, in: 32 }, hip: { cm: 107, in: 42 } },
  { size: 'XL', bust: { cm: 104, in: 41 }, waist: { cm: 86, in: 34 }, hip: { cm: 114, in: 45 } },
  { size: 'XXL', bust: { cm: 112, in: 44 }, waist: { cm: 97, in: 38 }, hip: { cm: 122, in: 48 } },
];
