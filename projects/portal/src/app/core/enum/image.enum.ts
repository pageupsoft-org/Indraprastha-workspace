export enum ImageTypeEnum {
  png = 'image/png',
  jpeg = 'image/jpeg',
  jpg = 'image/jpg',
  webp = 'image/webp'
}

export const ImageSizeConst = {
  product: { width: 1400, height: 2100 },
  productVariant: { width: 1400, height: 2100 },
  banner: { width: 1536, height: 1024 },
  lastBanner: { width: 690, height: 1038 },
  midBanner: { width: 1920, height: 1280 },
} as const;
