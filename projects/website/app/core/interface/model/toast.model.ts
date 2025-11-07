import { EToastType } from "../../enum/toast-type.enum";

export interface Toast {
  message: string;
  type: EToastType;
  duration?: number;
}
