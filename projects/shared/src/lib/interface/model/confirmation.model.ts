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
    heading: heading ?? 'Confirm',
    body: body ?? 'Are you sure you want to delete this ?',
    yesText: yesText ?? 'Yes',
    noText: noText ?? 'No',
  };
}