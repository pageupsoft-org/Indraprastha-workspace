export interface MConfirmationModalData {
  heading: string;
  body: string;
  yesText: string;
  noText: string;
}


export const getDefaultConfirmationModalData = (
  heading?: string,
  body?: string,
  yesText?: string,
  noText?: string
): MConfirmationModalData => {
  return {
    heading: 'Confirm',
    body: 'Are you sure you want to delete this ?',
    yesText: 'Yes',
    noText: 'No',
  };
}