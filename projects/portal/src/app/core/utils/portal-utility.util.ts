import { ImageTypeEnum } from '../enum/image-type.enum';

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

export function convertImagesToBase64Array(
  event: Event,
  allowedTypes: string[] = [ImageTypeEnum.jpeg, ImageTypeEnum.jpeg]
): Promise<{
  validBase64Files: (string | ArrayBuffer | null)[];
  invalidFiles: string[];
  message: string | null;
}> {
  return new Promise((resolve, reject) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      reject('No files selected');
      return;
    }

    const fileArray = Array.from(files);

    // Separate valid + invalid files
    const validFiles = fileArray.filter((f) => allowedTypes.includes(f.type));
    const invalidFiles = fileArray.filter((f) => !allowedTypes.includes(f.type)).map((f) => f.name);

    // If no valid files
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
        reader.onload = () => resolveFile(reader.result);
        reader.onerror = (error) => rejectFile(error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(base64Promises)
      .then((result) => {
        resolve({
          validBase64Files: result,
          invalidFiles,
          message: invalidFiles.length > 0 ? 'Some files were invalid and skipped' : null,
        });
      })
      .catch(reject);
  });
}

// export function convertImagesToBase64Array(event: Event): Promise<(string | ArrayBuffer | null)[]> {
//   return new Promise((resolve, reject) => {
//     const input = event.target as HTMLInputElement;
//     const files = input.files;

//     if (!files || files.length === 0) {
//       reject('No files selected');
//       return;
//     }

//     // Convert the FileList into a standard array of files
//     const fileArray = Array.from(files);

//     // Create an array of promises, one for each file
//     const base64Promises = fileArray.map((file) => {
//       return new Promise<string | ArrayBuffer | null>((resolveFile, rejectFile) => {
//         const reader = new FileReader();

//         reader.onload = () => resolveFile(reader.result);
//         reader.onerror = (error) => rejectFile(error);

//         reader.readAsDataURL(file);
//       });
//     });

//     // Use Promise.all to wait for all file reading promises to complete
//     Promise.all(base64Promises)
//       .then(resolve) // Resolve the main promise with the array of results
//       .catch(reject); // Reject the main promise if any file conversion fails
//   });
// }

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
