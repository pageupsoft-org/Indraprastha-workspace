import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  EDescriptionType,
  EStockSize,
  GenderTypeEnum,
  IPaginationPayload,
  patternWithMessage,
} from '@shared';

export interface IProductForm {
  id: FormControl<number | null>;
  categoryIds: FormControl<Array<number> | null>;
  categoryId: FormControl<number | null>;
  collectionId: FormControl<number | null>;
  categoryIdsList: FormControl<Array<{ id: number; name: string }> | null>;
  name: FormControl<string | null>;
  isCustomSize: FormControl<boolean | null>;
  customSizeName: FormControl<string | null>;
  color: FormArray<FormControl<string | null>>;
  mrp: FormControl<number | null>;
  gender: FormControl<string | null>;

  isVariant: FormControl<boolean | null>;
  // variants: FormArray<FormGroup<IVariantForm>>;
  colorVariants: FormArray<FormGroup<IColorVariantForm>>;
  descriptions: FormArray<FormGroup<IDescriptionForm>>;
  productBase64: FormArray<FormControl<string | null>>;
  removeURL: FormControl<string[] | null>;
}

export interface IColorVariantForm {
  id: FormControl<number | null>;
  productId: FormControl<number | null>;

  // model: colorName
  colorName: FormControl<string | null>;

  // model: stocks
  stocks: FormArray<FormGroup<stocks>>;

  // model: colorVariantBase64
  colorVariantBase64: FormArray<FormControl<string | null>>;

  // model: productBase64
  productBase64: FormArray<FormControl<string | null>>;

  // model: removeURL
  removeURL: FormArray<FormControl<string | null>>;
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
  data: IJsonTextFormData | null,
): FormGroup<IJsonTextForm> => {
  const form = new FormGroup<IJsonTextForm>({
    key: new FormControl<string>('', [Validators.required, Validators.maxLength(40)]),
    value: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
  });

  if (data) {
    form.patchValue(data);
  }

  return form;
};

export const initializeDescriptionForm = (
  data: IDescriptionData | null,
): FormGroup<IDescriptionForm> => {
  const form = new FormGroup<IDescriptionForm>({
    header: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(40)]),
    descriptionType: new FormControl<EDescriptionType | null>(EDescriptionType.SingleText),
    description: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(400),
    ]),
    shortDescription: new FormControl<string | null>(null, [Validators.maxLength(70)]),
    jsonText: new FormArray<FormGroup<IJsonTextForm>>([]),
  });
  if (data) {
    form.patchValue(data);
  }

  return form;
};

export const initializeColorVariantForm = (data: any | null): FormGroup<IColorVariantForm> => {
  const form = new FormGroup<IColorVariantForm>({
    id: new FormControl<number | null>(0),
    productId: new FormControl<number | null>(0),
    colorName: new FormControl<string | null>(null, [Validators.maxLength(40)]),
    stocks: new FormArray<FormGroup<stocks>>([]),
    colorVariantBase64: new FormArray<FormControl<string | null>>([]),
    productBase64: new FormArray<FormControl<string | null>>([]),
    removeURL: new FormArray<FormControl<string | null>>([]),
  });

  if (data) {
    // Patch basic fields
    form.patchValue({
      id: data.id,
      productId: data.productId,
      colorName: data.name,
    });

    // Populate colorVariantBase64 with existing images (up to 6)
    if (data.variantURL && Array.isArray(data.variantURL)) {
      data.variantURL.slice(0, 6).forEach((url: string) => {
        form.controls.colorVariantBase64.push(new FormControl<string | null>(url));
      });
    }

    // Fill remaining slots up to 6 with null
    const currentImageCount = form.controls.colorVariantBase64.length;
    for (let i = currentImageCount; i < 6; i++) {
      form.controls.colorVariantBase64.push(new FormControl<string | null>(null));
    }

    // Handle stocks
    if (data.stocks) {
      form.controls.stocks.push(
        new FormGroup<stocks>({
          quantity: new FormControl<number | null>(data.stocks.quantity, [
            Validators.required,
            Validators.maxLength(4),
            patternWithMessage(/^[0-9]\d*$/, 'Please enter a valid quantity'),
          ]),
          size: new FormControl<EStockSize | null>(null),
        }),
      );
    }
  } else {
    // For new variants, initialize with 6 null image slots
    for (let i = 0; i < 6; i++) {
      form.controls.colorVariantBase64.push(new FormControl<string | null>(null));
    }
  }

  return form;
};

export const initializeStockForm = (
  quantity?: number | null,
  size?: EStockSize | null,
): FormGroup<stocks> =>
  new FormGroup<stocks>({
    quantity: new FormControl<number | null>(quantity ?? null, [
      Validators.required,
      Validators.maxLength(4),
      patternWithMessage(/^[0-9]\d*$/, 'Please enter a valid quantity'),
    ]),
    size: new FormControl<EStockSize | null>(size ?? null),
  });

// --- Main Form Initialization ---
export const initializeIProductForm = (): FormGroup<IProductForm> =>
  new FormGroup<IProductForm>({
    id: new FormControl<number | null>(0),
    categoryIds: new FormControl<number[]>([]),
    categoryId: new FormControl<number | null>(null, [Validators.required]),
    collectionId: new FormControl<number | null>(null, Validators.required),
    categoryIdsList: new FormControl<Array<{ id: number; name: string }> | null>([]),
    name: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(70)]),
    isCustomSize: new FormControl<boolean | null>(false),
    customSizeName: new FormControl<string | null>(''),
    color: new FormArray<FormControl<string | null>>([]),
    mrp: new FormControl<number | null>(null, [
      Validators.required,
      Validators.maxLength(10),
      patternWithMessage(/^\d+(\.\d{1,2})?$/, 'Enter a valid price'),
    ]),
    isVariant: new FormControl<boolean | null>(false),
    gender: new FormControl<GenderTypeEnum | null>(null, Validators.required),
    colorVariants: new FormArray<FormGroup<IColorVariantForm>>([]),
    descriptions: new FormArray<FormGroup<IDescriptionForm>>([]),
    productBase64: new FormArray<FormControl<string | null>>([]),
    removeURL: new FormControl<string[] | null>([]),
  });

export interface IProductPagination extends IPaginationPayload {
  categoryId: number | null;
  gender: GenderTypeEnum | null;
}

export interface IProductResponseRoot {
  total: number;
  products: IProduct[];
}

export interface IProduct {
  name: string;
  isCustomSize: boolean;
  customSizeName: string;
  color: string[];
  mrp: number;
  gender: string;
  productURL: string[];
  isActive: boolean;
  stockId: number;
  size: string;
  quantity: number;
  id: number;
}

export interface IStepperStep {
  step: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  nextButtonText?: string;
}

export const stepperFormSteps: IStepperStep[] = [
  {
    step: 1,
    title: 'Basic Information',
    shortTitle: 'Basic Info',
    description: 'Enter the essential details about your product',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    nextButtonText: 'Next: Color Variants',
  },
  {
    step: 2,
    title: 'Color Variants',
    shortTitle: 'Variants',
    description: 'Create different color variants of your product (optional)',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    nextButtonText: 'Next: Details',
  },
  {
    step: 3,
    title: 'Product Descriptions',
    shortTitle: 'Details',
    description: 'Add detailed descriptions for your product (optional)',
    icon: 'M4 6h16M4 12h16M4 18h7',
    nextButtonText: 'Create Product',
  },
];
