export interface IConvertImageResult {
  validBase64Files: (string | ArrayBuffer | null)[];
  invalidFiles: string[];
  message: string | null;
}

export interface IConvertImageParams {
  event: Event;
  allowedTypes: string[];
  expectedImgHeight: number;
  expectedImgWidth: number;
}

export const initialConvertImageParam = (data: IConvertImageParams) => ({ ...data });


