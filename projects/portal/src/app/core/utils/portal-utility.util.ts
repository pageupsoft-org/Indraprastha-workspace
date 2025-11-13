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

export function convertImagesToBase64Array(event: Event): Promise<(string | ArrayBuffer | null)[]> {
  return new Promise((resolve, reject) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      reject('No files selected');
      return;
    }

    // Convert the FileList into a standard array of files
    const fileArray = Array.from(files);

    // Create an array of promises, one for each file
    const base64Promises = fileArray.map((file) => {
      return new Promise<string | ArrayBuffer | null>((resolveFile, rejectFile) => {
        const reader = new FileReader();

        reader.onload = () => resolveFile(reader.result);
        reader.onerror = (error) => rejectFile(error);

        reader.readAsDataURL(file);
      });
    });

    // Use Promise.all to wait for all file reading promises to complete
    Promise.all(base64Promises)
      .then(resolve) // Resolve the main promise with the array of results
      .catch(reject); // Reject the main promise if any file conversion fails
  });
}
