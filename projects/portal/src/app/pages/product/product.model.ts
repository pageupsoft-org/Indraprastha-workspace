import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  EDescriptionType,
  EStockSize,
  GenderTypeEnum,
  IPaginationPayload,
  patternWithMessage,
} from '@shared';

export interface IStepperStep {
  step: number;
  title: string;
  shortTitle: string;
  description?: string;
  nextButtonText?: string;
}

export const stepperFormSteps: IStepperStep[] = [
  {
    step: 1,
    title: 'Basic Information',
    shortTitle: 'Basic Info',
    description: 'Product details and categorization',
    nextButtonText: 'Next',
  },
  {
    step: 2,
    title: 'Color Variants',
    shortTitle: 'Variants',
    description: 'Product variants and stock management',
    nextButtonText: 'Next',
  },
  {
    step: 3,
    title: 'Descriptions',
    shortTitle: 'Descriptions',
    description: 'Product descriptions and additional information',
    nextButtonText: 'Save Product',
  },
];

export interface IProductForm {
  id: FormControl<number | null>;
  categoryIds: FormControl<Array<number> | null>;
  categoryId: FormControl<number | null>;
  collectionId: FormControl<number | null>;
  categoryIdsList: FormControl<Array<{ id: number; name: string }> | null>;
  name: FormControl<string | null>;
  isCustomSize: FormControl<boolean | null>;
  customSizeName: FormControl<string | null>;
  gender: FormControl<string | null>;
  color: FormArray<FormControl<string | null>>;
  mrp: FormControl<number | null>;

  isVariant: FormControl<boolean | null>;
  colorVariants: FormArray<FormGroup<IColorVariantForm>>; // Changed from `variants` to `colorVariants` and `IVariantForm` to `IColorVariantForm`
  descriptions: FormArray<FormGroup<IDescriptionForm>>;
  variants: FormArray<FormGroup<IVariantForm>>;
  // productBase64: FormArray<FormControl<string | null>>;
  // removeURL: FormControl<string[] | null>;
}
export const initializeIProductForm = (): FormGroup<IProductForm> => {
  return new FormGroup<IProductForm>({
    id: new FormControl<number | null>(0),
    categoryIds: new FormControl<number[] | null>(null),
    categoryId: new FormControl<number | null>(null),
    collectionId: new FormControl<number | null>(null),
    categoryIdsList: new FormControl<Array<{ id: number; name: string }> | null>(null),
    name: new FormControl<string | null>(null),
    isCustomSize: new FormControl<boolean | null>(false),
    customSizeName: new FormControl<string | null>(null),
    gender: new FormControl<string | null>(null),
    color: new FormArray<FormControl<string | null>>([]),
    mrp: new FormControl<number | null>(null),
    isVariant: new FormControl<boolean | null>(false),
    colorVariants: new FormArray<FormGroup<IColorVariantForm>>([]),
    descriptions: new FormArray<FormGroup<IDescriptionForm>>([]),
    variants: new FormArray<FormGroup<IVariantForm>>([]),
    // productBase64: new FormArray<FormControl<string | null>>([]),
    // removeURL: new FormControl<string[] | null>(null),
  });
};

export interface IVariantForm {
  id: FormControl<number | null>;
  productId: FormControl<number | null>;
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  mrp: FormControl<number | null>;
  isCustom: FormControl<boolean | null>;
}
export function initVariantForm(): IVariantForm {
  return {
    id: new FormControl<number | null>(0),
    productId: new FormControl<number | null>(0),
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    mrp: new FormControl<number | null>(0),
    isCustom: new FormControl<boolean>(false),
  };
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

export interface IColorVariantData {
  // Renamed from IVariantData
  id: number | null;
  productId: number | null;
  name: string | null;
  description: string | null;
  mrp: number | null;
  stocks: {
    quantity: number | null;
  };
  variantURL: string | null; // Renamed from variantBase64 to variantURL
}

export interface stocks {
  quantity: FormControl<number | null>;
  size: FormControl<EStockSize | null>;
}
export const initializeStockForm = (quantity: number = 0, size: EStockSize): FormGroup<stocks> => {
  return new FormGroup<stocks>({
    quantity: new FormControl<number | null>(quantity),
    size: new FormControl<EStockSize | null>(size),
  });
};

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
  // Changed type of data to any | null
  const form = new FormGroup<IColorVariantForm>({
    id: new FormControl<number | null>(0),
    productId: new FormControl<number | null>(0),
    colorName: new FormControl<string | null>('#9d1e21', [Validators.maxLength(40)]),
    stocks: new FormArray<FormGroup<stocks>>([]),
    colorVariantBase64: new FormArray<FormControl<string | null>>([]), // Initialize as empty array
    productBase64: new FormArray<FormControl<string | null>>([]),
    removeURL: new FormArray<FormControl<string | null>>([]),
  });

  if (data) {
    form.patchValue({
      id: data.id,
      productId: data.productId,
      colorName: data.name, // Changed from name to colorName
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

export interface IProductPagination extends IPaginationPayload {
  categoryId: number | null;
  collectionId: number | null;
  gender: string | null;
}

export interface IProduct {
  name: string;
  isCustomSize: boolean;
  customSizeName: string;
  collectionName: string;
  collectionId: number;
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

export interface IProductResponseRoot {
  total: number;
  products: IProduct[];
}
