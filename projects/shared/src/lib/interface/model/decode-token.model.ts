export interface IDecodeTokenKey {
  Id: string;

  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;

  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;

  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;

  LoginType: string;
  LoginId: string;
  jti: string;
  exp: number;
}
