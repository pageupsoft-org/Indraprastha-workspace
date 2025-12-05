import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
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



/**
 * Walks a FormGroup/FormArray recursively and logs every invalid FormControl.
 * - path: e.g. "variants[0].size" or "name"
 * - errors: the control.errors object (JSON.stringified)
 *
 * @param root the root FormGroup (e.g. FormGroup<IProductForm>)
 * @param options.optionalMarkTouched if true will mark invalid controls as touched
 */
export function logInvalidControls(
  root: AbstractControl,
  options: { markTouched?: boolean } = {}
): void {
  const results: { path: string; errors: any }[] = [];

  function walk(control: AbstractControl, path: string) {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach((key) => {
        const child = control.controls[key];
        const childPath = path ? `${path}.${key}` : key;
        walk(child, childPath);
      });
      return;
    }

    if (control instanceof FormArray) {
      control.controls.forEach((child, index) => {
        const childPath = `${path}[${index}]`;
        walk(child, childPath);
      });
      return;
    }

    // it's a FormControl
    if (control instanceof FormControl) {
      if (control.invalid) {
        if (options.markTouched) control.markAsTouched({ onlySelf: true });

        // Clone the errors so we can safely stringify (avoid circular refs)
        let errorsSafe: any = control.errors;
        try {
          errorsSafe = errorsSafe ? JSON.parse(JSON.stringify(errorsSafe)) : errorsSafe;
        } catch {
          // fallback if stringify fails
          errorsSafe = control.errors;
        }

        results.push({ path, errors: errorsSafe });

        // Log immediately as well (useful for console)
        console.warn(`Invalid control -> ${path}`, errorsSafe);
      }
      return;
    }

    // Fallback for any other AbstractControl subtype (rare)
    if (control && (control as any).invalid) {
      const err = (control as any).errors;
      console.warn(`Invalid control -> ${path}`, err);
      results.push({ path, errors: err });
    }
  }

  walk(root, '');

  // Optionally: return or further process results
  // For now we just log a summary
  if (results.length === 0) {
    console.info('No invalid controls found.');
  } else {
    console.info(`Total invalid controls: ${results.length}`);
    results.forEach((r) => console.info(r.path, r.errors));
  }
}