import { EToastType } from "../../enum/toast-type.enum";

export interface ToastModel {
  message: string;
  type: EToastType;
  duration?: number;
}
