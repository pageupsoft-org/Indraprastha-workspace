import { ImageTypeEnum } from '../enum/image.enum';
import { IConvertImageParams } from '../interface/model/portal-util.model';

export function convertImageInputToBase64(event: Event): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      reject('No file selected');
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
}

// export function convertImagesToBase64Array(
//   event: Event,
//   allowedTypes: string[] = [ImageTypeEnum.jpeg, ImageTypeEnum.jpeg]
// ): Promise<{
//   validBase64Files: (string | ArrayBuffer | null)[];
//   invalidFiles: string[];
//   message: string | null;
// }> {
//   return new Promise((resolve, reject) => {
//     const input = event.target as HTMLInputElement;
//     const files = input.files;

//     if (!files || files.length === 0) {
//       reject('No files selected');
//       return;
//     }

//     const fileArray = Array.from(files);

//     // Separate valid + invalid files
//     const validFiles = fileArray.filter((f) => allowedTypes.includes(f.type));
//     const invalidFiles = fileArray.filter((f) => !allowedTypes.includes(f.type)).map((f) => f.name);

//     // If no valid files
//     if (validFiles.length === 0) {
//       resolve({
//         validBase64Files: [],
//         invalidFiles,
//         message: 'Invalid file type selected',
//       });
//       return;
//     }

//     const base64Promises = validFiles.map((file) => {
//       return new Promise<string | ArrayBuffer | null>((resolveFile, rejectFile) => {
//         const reader = new FileReader();
//         reader.onload = () => resolveFile(reader.result);
//         reader.onerror = (error) => rejectFile(error);
//         reader.readAsDataURL(file);
//       });
//     });

//     Promise.all(base64Promises)
//       .then((result) => {
//         resolve({
//           validBase64Files: result,
//           invalidFiles,
//           message: invalidFiles.length > 0 ? 'Some files were invalid and skipped' : null,
//         });
//       })
//       .catch(reject);
//   });
// }

export function convertImagesToBase64Array(
  // event: Event,
  // allowedTypes: string[] = [ImageTypeEnum.jpeg, ImageTypeEnum.png],
  // expectedWidth?: number,
  // expectedHeight?: number
  param: IConvertImageParams
): Promise<{
  validBase64Files: (string | ArrayBuffer | null)[];
  invalidFiles: string[];
  message: string | null;
}> {
  return new Promise((resolve, reject) => {
    const input = param.event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      reject('No files selected');
      return;
    }

    const fileArray = Array.from(files);

    const validFiles = fileArray.filter((f) => param.allowedTypes.includes(f.type));
    const invalidFiles = fileArray
      .filter((f) => !param.allowedTypes.includes(f.type))
      .map((f) => f.name);

    if (validFiles.length === 0) {
      resolve({
        validBase64Files: [],
        invalidFiles,
        message: 'Invalid file type selected',
      });
      return;
    }

    const base64Promises = validFiles.map((file) => {
      return new Promise<string | ArrayBuffer | null>((resolveFile, rejectFile) => {
        const reader = new FileReader();

        reader.onload = () => {
          const base64 = reader.result;

          // Image dimension check
          const img = new Image();
          img.onload = () => {
            const isExactMatch =
              (!param.expectedImgWidth || img.width === param.expectedImgWidth) &&
              (!param.expectedImgHeight || img.height === param.expectedImgHeight);

            if (!isExactMatch) {
              invalidFiles.push(file.name);
              console.log(
                'Invalid dimensions for file:',
                file.name,
                'Expected:',
                param.expectedImgWidth,
                'x',
                param.expectedImgHeight,
                'Got:',
                img.width,
                'x',
                img.height
              );
              resolveFile(null);
            } else {
              resolveFile(base64);
            }
          };

          img.onerror = () => rejectFile('Invalid image file');
          img.src = base64 as string;
        };

        reader.onerror = (error) => rejectFile(error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(base64Promises)
      .then((result) => {
        const filteredResults = result.filter((r) => r !== null);

        resolve({
          validBase64Files: filteredResults,
          invalidFiles,
          message:
            invalidFiles.length > 0 ? 'Some files were invalid or had incorrect dimensions' : null,
        });
      })
      .catch(reject);
  });
}

/**
 * Converts an array of { key: string, value: string } objects into a single JSON object (key-value map).
 * @param {Array<{key: string, value: string}>} arr The input array.
 * @returns {Record<string, string>} The resulting JSON object.
 */
export function arrayToJson(arr) {
  if (!Array.isArray(arr)) {
    console.error('Input must be an array.');
    return {};
  }

  // Uses 'reduce' to iterate over the array and build the accumulator object.
  return arr.reduce((accumulator, currentItem) => {
    // We use the 'key' as the property name and 'value' as the property value.
    // Type casting is used here as a safeguard if properties are missing.
    const key = String(currentItem.key);
    const value = String(currentItem.value);

    if (key && value) {
      accumulator[key] = value;
    }
    return accumulator;
  }, {});
}
