import { HttpContextToken } from '@angular/common/http';

export const CustomToken = {
  AUTH_REQUIRED: new HttpContextToken<boolean>(() => true),
};
