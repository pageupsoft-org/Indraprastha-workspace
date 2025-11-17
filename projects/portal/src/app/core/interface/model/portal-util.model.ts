export interface IConvertImageResult {
  validBase64Files: (string | ArrayBuffer | null)[];
  invalidFiles: string[];
  message: string | null;
}
