import { FormControl, FormGroup } from "@angular/forms";

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
    }>
    billingAddress: FormGroup<{
        shippingAddress: FormControl<boolean | null>;
        billingAddress: FormControl<boolean | null>;
    }>
}

// intiialize ICheckoutForm
export const initializeICheckoutForm = (): FormGroup<ICheckoutForm> =>
    new FormGroup<ICheckoutForm>({
      contactNumber: new FormControl<string | null>(null),
      deliveryAddress: new FormGroup({
        country: new FormControl<string | null>(null),
        firstName: new FormControl<string | null>(null),
        lastName: new FormControl<string | null>(null),
        address: new FormControl<string | null>(null),
        apartment: new FormControl<string | null>(null),
        city: new FormControl<string | null>(null),
        state: new FormControl<string | null>(null),
        pinCode: new FormControl<string | null>(null),
        phoneNumber: new FormControl<string | null>(null),
        isSavedAddress: new FormControl<boolean | null>(null),
        isUpdateNewOffers: new FormControl<boolean | null>(null),
      }),
      billingAddress: new FormGroup({   
        shippingAddress: new FormControl<boolean | null>(null),
        billingAddress: new FormControl<boolean | null>(null),
      })
    })