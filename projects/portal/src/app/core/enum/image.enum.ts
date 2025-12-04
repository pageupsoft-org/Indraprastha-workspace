export enum ImageTypeEnum {
  png = 'image/png',
  jpeg = 'image/jpeg',
  webp = 'image/webp'
}

export const ImageSizeConst = {
  product: { width: 1400, height: 2100 },
  productVariant: { width: 1400, height: 2100 },
  banner: { width: 1536, height: 1024 },
} as const;
