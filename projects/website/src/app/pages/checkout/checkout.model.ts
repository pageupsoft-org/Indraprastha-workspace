import { FormControl, FormGroup, Validators } from '@angular/forms';
import { patternWithMessage } from '@shared';
import { validateHeaderName } from 'http';

export interface ICheckoutForm {
  contactNumber: FormControl<string | null>;
  deliveryAddress: FormGroup<{
    country: FormControl<string | null>;
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    address: FormControl<string | null>;
    apartment: FormControl<string | null>;
    city: FormControl<string | null>;
    state: FormControl<string | null>;
    pinCode: FormControl<string | null>;
    phoneNumber: FormControl<string | null>;
    isSavedAddress: FormControl<boolean | null>;
    isUpdateNewOffers: FormControl<boolean | null>;
  }>;
  billingAddress: FormGroup<{
    shippingAddress: FormControl<boolean | null>;
    billingAddress: FormControl<boolean | null>;
  }>;
}

// intiialize ICheckoutForm
export const initializeICheckoutForm = (): FormGroup<ICheckoutForm> =>
  new FormGroup<ICheckoutForm>({
    contactNumber: new FormControl<string | null>(null, [
      Validators.required,
      patternWithMessage(/^[0-9]{10}$/, 'Contact number must be 10 digits only'),
    ]),
    deliveryAddress: new FormGroup({
      country: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      firstName: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      lastName: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      address: new FormControl<string | null>(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      apartment: new FormControl<string | null>(null, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      city: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(30)]),
      state: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(30)]),
      pinCode: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
      phoneNumber: new FormControl<string | null>(null, [
        Validators.required,
        patternWithMessage(/^[0-9]{10}$/, 'Phone number must be 10 digits only'),
      ]),
      isSavedAddress: new FormControl<boolean | null>(null),
      isUpdateNewOffers: new FormControl<boolean | null>(null),
    }),
    billingAddress: new FormGroup({
      shippingAddress: new FormControl<boolean | null>(null),
      billingAddress: new FormControl<boolean | null>(null),
    }),
  });

export interface IResponseCheckout {
  totalAmount: number;
  shippingAddresses: ShippingAddress[];
  products: Product[];
}

export const initializeResponseCheckout = (): IResponseCheckout => {
  return {
    totalAmount: 0,
    shippingAddresses: [],
    products: [],
  };
};

export interface ShippingAddress {
  id: number;
  address: string;
  state: string;
  city: string;
  pinCode: string;
  email: string;
  contact: string;
  country: string;
  region: string;
  apartment: string;
  firstName: string;
  lastName: string;
}
export interface Product {
  name: string;
  color: string[];
  mrp: number;
  gender: string;
  productURL: string[];
  stockId: number;
  size: string;
  stockQuantity: number;
  cartQuantity: number;
  cartId: number;
  productId: number;
  cartVariant?: CartVariant;
  _isDisable: boolean;
}

export interface CartVariant {
  name: string;
  mrp: number;
  variantURL: string;
  stockId: number;
  stockQuantity: number;
  cartQuantity: number;
  variantId: number;
}
