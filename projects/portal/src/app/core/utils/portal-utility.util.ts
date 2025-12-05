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
//   param: IConvertImageParams
// ): Promise<{
//   validBase64Files: (string | ArrayBuffer | null)[];
//   invalidFiles: string[];
//   message: string | null;
// }> {
//   return new Promise((resolve, reject) => {
//     const input = param.event.target as HTMLInputElement;
//     const files = input.files;

//     if (!files || files.length === 0) {
//       reject('No files selected');
//       return;
//     }

//     const fileArray = Array.from(files);

//     const validFiles = fileArray.filter((f) => param.allowedTypes.includes(f.type));
//     const invalidFiles = fileArray
//       .filter((f) => !param.allowedTypes.includes(f.type))
//       .map((f) => f.name);

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

//         reader.onload = () => {
//           const base64 = reader.result;

//           // Image dimension check
//           const img = new Image();
//           img.onload = () => {
//             const isExactMatch =
//               (!param.expectedImgWidth || img.width === param.expectedImgWidth) &&
//               (!param.expectedImgHeight || img.height === param.expectedImgHeight);

//             if (!isExactMatch) {
//               invalidFiles.push(file.name);
//               console.log(
//                 'Invalid dimensions for file:',
//                 file.name,
//                 'Expected:',
//                 param.expectedImgWidth,
//                 'x',
//                 param.expectedImgHeight,
//                 'Got:',
//                 img.width,
//                 'x',
//                 img.height
//               );
//               resolveFile(null);
//             } else {
//               resolveFile(base64);
//             }
//           };

//           img.onerror = () => rejectFile('Invalid image file');
//           img.src = base64 as string;
//         };

//         reader.onerror = (error) => rejectFile(error);
//         reader.readAsDataURL(file);
//       });
//     });

//     Promise.all(base64Promises)
//       .then((result) => {
//         const filteredResults = result.filter((r) => r !== null);

//         resolve({
//           validBase64Files: filteredResults,
//           invalidFiles,
//           message:
//             invalidFiles.length > 0 ? 'Some files were invalid or had incorrect dimensions' : null,
//         });
//       })
//       .catch(reject);
//   });
// }
export function convertImagesToBase64Array(param: IConvertImageParams): Promise<{
  validBase64Files: (string | ArrayBuffer | null)[];
  invalidFiles: string[];
  message: string | null;
}> {
  const webpQuality: number = 0.6;
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
        // 🔹 File size validation
        const fileSizeMB = file.size / (1024 * 1024);
        console.log(fileSizeMB);

        if (param.maxSize && fileSizeMB > param.maxSize) {
          invalidFiles.push(`${file.name} (File too large: ${fileSizeMB.toFixed(2)}MB)`);
          resolveFile(null);
          return;
        }

        const reader = new FileReader();

        reader.onload = () => {
          const base64 = reader.result;

          // 🔹 Image dimension check
          const img = new Image();
          img.onload = () => {
            const isWidthOk = !param.expectedImgWidth || img.width === param.expectedImgWidth;
            const isHeightOk = !param.expectedImgHeight || img.height === param.expectedImgHeight;

            if (!isWidthOk || !isHeightOk) {
              invalidFiles.push(`${file.name} (Invalid dimensions: ${img.width}x${img.height})`);
              resolveFile(null);
              return;
            }

            // 🌟 Convert to WebP + compress
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);

            // Convert to WebP Base64
            const compressedBase64 = canvas.toDataURL('image/webp', webpQuality ?? 0.7);

            // 🧮 Log size reduction
            // const originalSizeKB = file.size / 1024;
            // const compressedSizeKB = Math.round((compressedBase64.length * (3 / 4)) / 1024); // base64 -> bytes -> KB

            // console.log(
            //   `File: ${file.name}\n` +
            //     `Original: ${originalSizeKB.toFixed(2)} KB\n` +
            //     `Compressed: ${compressedSizeKB} KB\n` +
            //     `Reduced: ${(originalSizeKB - compressedSizeKB).toFixed(2)} KB (${(
            //       (1 - compressedSizeKB / originalSizeKB) *
            //       100
            //     ).toFixed(1)}%)`
            // );

            resolveFile(compressedBase64);
          };

          // img.onload = () => {
          //   const isWidthOk = !param.expectedImgWidth || img.width === param.expectedImgWidth;
          //   const isHeightOk = !param.expectedImgHeight || img.height === param.expectedImgHeight;

          //   if (!isWidthOk || !isHeightOk) {
          //     invalidFiles.push(`${file.name} (Invalid dimensions: ${img.width}x${img.height})`);
          //     resolveFile(null);
          //   } else {
          //     resolveFile(base64);
          //   }
          // };

          img.onerror = () => rejectFile('Invalid image file');
          img.src = base64 as string;
        };

        reader.onerror = (error) => rejectFile(error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(base64Promises)
      .then((results) => {
        const filtered = results.filter((r) => r !== null);

        resolve({
          validBase64Files: filtered,
          invalidFiles,
          message:
            invalidFiles.length > 0 ? 'Some files were invalid (type, size, or dimensions)' : null,
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
