import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IPaginationPayload } from './genericPayload';
import { EDescriptionType } from '@shared';
import { EStockSize } from '@shared';
import { patternWithMessage } from '@shared';
import { GenderTypeEnum } from '@shared';
// import { EGender } from "../../enum/gender.enum";

export interface IProductForm {
  id: FormControl<number | null>;
  categoryIds: FormControl<Array<number> | null>;
  categoryIdsList: FormControl<Array<{ id: number; name: string }> | null>;
  name: FormControl<string | null>;
  isCustomSize: FormControl<boolean | null>;
  customSizeName: FormControl<string | null>;
  color: FormArray<FormControl<string | null>>;
  mrp: FormControl<number | null>;
  gender: FormControl<string | null>;
  variants: FormArray<FormGroup<IVariantForm>>;
  stocks: FormArray<FormGroup<stocks>>;
  descriptions: FormArray<FormGroup<IDescriptionForm>>;
  productBase64: FormArray<FormControl<string | null>>;
  removeURL: FormControl<Array<string> | null>;
}

export interface IVariantForm {
  id: FormControl<number | null>;
  productId: FormControl<number | null>;
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  mrp: FormControl<number | null>;
  stocks: FormGroup<{
    quantity: FormControl<number | null>;
  }>;
  variantBase64: FormControl<string | null>;
}
export interface IVariantData {
  id: number | null;
  productId: number | null;
  name: string | null;
  description: string | null;
  mrp: number | null;
  stocks: {
    quantity: number | null;
  };
  variantBase64: string | null;
}

export interface stocks {
  quantity: FormControl<number | null>;
  size: FormControl<EStockSize | null>;
}

export interface IDescriptionForm {
  header: FormControl<string | null>;
  descriptionType: FormControl<EDescriptionType | null>;
  description: FormControl<string | null>;
  shortDescription: FormControl<string | null>;
  jsonText: FormArray<FormGroup<IJsonTextForm>>;
}
export interface IDescriptionData {
  header: string | null;
  descriptionType: EDescriptionType | null;
  description: string | null;
  shortDescription: string | null;
  jsonText: IJsonTextFormData[];
}

export interface IJsonTextForm {
  key: FormControl<string | null>;
  value: FormControl<string | null>;
}

export interface IJsonTextFormData {
  key: string | null;
  value: string | null;
}

// --- Initialization Helpers ---
export const initializeJsonTextForm = (
  data: IJsonTextFormData | null
): FormGroup<IJsonTextForm> => {
  const form = new FormGroup<IJsonTextForm>({
    key: new FormControl<string>('', Validators.required),
    value: new FormControl<string>('', Validators.required),
  });

  if (data) {
    form.patchValue(data);
  }

  return form;
};

export const initializeDescriptionForm = (
  data: IDescriptionData | null
): FormGroup<IDescriptionForm> => {
  const form = new FormGroup<IDescriptionForm>({
    header: new FormControl<string | null>(null, Validators.required),
    descriptionType: new FormControl<EDescriptionType | null>(EDescriptionType.SingleText),
    description: new FormControl<string | null>(null, Validators.required),
    shortDescription: new FormControl<string | null>(null),
    jsonText: new FormArray<FormGroup<IJsonTextForm>>([]),
  });
  if (data) {
    form.patchValue(data);
  }

  return form;
};

export const initializeVariantForm = (data: IVariantData | null): FormGroup<IVariantForm> => {
  const form = new FormGroup<IVariantForm>({
    id: new FormControl<number | null>(0),
    productId: new FormControl<number | null>(0),
    name: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required,),
    mrp: new FormControl<number | null>(null, [Validators.required, patternWithMessage(/^\d+(\.\d{1,2})?$/, ' Please enter a valid price (only numbers, up to 2 decimal places).')]),
    stocks: new FormGroup({
      quantity: new FormControl<number | null>(null, [Validators.required, patternWithMessage(/^[1-9]\d*$/, '  Please enter a valid quantity')]),
    }),
    variantBase64: new FormControl<string | null>(null, Validators.required,),
  });

  if (data) {
    form.patchValue(data);
  }

  return form;
};

export const initializeStockForm = (
  quantity?: number | null,
  size?: EStockSize | null
): FormGroup<stocks> =>
  new FormGroup<stocks>({
    quantity: new FormControl<number | null>(quantity ?? null, [Validators.required, patternWithMessage(/^[1-9]\d*$/, 'Please enter a valid quantity')]),
    size: new FormControl<EStockSize | null>(size ?? null),
  });


// --- Main Form Initialization ---
export const initializeIProductForm = (): FormGroup<IProductForm> =>
  new FormGroup<IProductForm>({
    id: new FormControl<number | null>(0),
    categoryIds: new FormControl<number[]>([]),
    categoryIdsList: new FormControl<Array<{ id: number; name: string }> | null>([]),
    name: new FormControl<string | null>(null, Validators.required),
    isCustomSize: new FormControl<boolean | null>(false),
    customSizeName: new FormControl<string | null>(''),
    color: new FormArray<FormControl<string | null>>([]),
    mrp: new FormControl<number | null>(null, [Validators.required, patternWithMessage(/^\d+(\.\d{1,2})?$/, ' Please enter a valid price (only numbers, up to 2 decimal places).')]),
    gender: new FormControl<GenderTypeEnum | null>(null, Validators.required),
    variants: new FormArray<FormGroup<IVariantForm>>([]),
    stocks: new FormArray<FormGroup<stocks>>([]),
    descriptions: new FormArray<FormGroup<IDescriptionForm>>([]),
    productBase64: new FormArray<FormControl<string | null>>([], Validators.required),
    removeURL: new FormControl<string[]>([]),
  });

export interface IProductPagination extends IPaginationPayload {
  categoryId: number | null;
  gender: GenderTypeEnum | null;
}

// export interface
