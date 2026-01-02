import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EDescriptionType, EStockSize, GenderTypeEnum, IPaginationPayload, patternWithMessage } from '@shared';


export interface IProductForm {
  id: FormControl<number | null>;
  categoryIds: FormControl<Array<number> | null>;
  categoryId: FormControl<number | null>;
  collectionId: FormControl<number | null>
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
    key: new FormControl<string>('', [Validators.required, Validators.maxLength(40)]),
    value: new FormControl<string>('', [Validators.required,  Validators.maxLength(100)]),
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
    header: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(40)]),
    descriptionType: new FormControl<EDescriptionType | null>(EDescriptionType.SingleText),
    description: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(400),]),
    shortDescription: new FormControl<string | null>(null, [Validators.maxLength(70)]),
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
    name: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(40)]),
    description: new FormControl<string | null>(null,[Validators.maxLength(170)]),
    mrp: new FormControl<number | null>(null, [Validators.required, Validators.maxLength(10), 
      patternWithMessage(/^\d+(\.\d{1,2})?$/, 'enter a valid price')]),
    stocks: new FormGroup({
      quantity: new FormControl<number | null>(null, [Validators.required, Validators.maxLength(4), patternWithMessage(/^[1-9]\d*$/, 'Please enter a valid quantity')]),
    }),
    variantBase64: new FormControl<string | null>(null),
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
    quantity: new FormControl<number | null>(quantity ?? null, [Validators.required, Validators.maxLength(4), patternWithMessage(/^[0-9]\d*$/, 'Please enter a valid quantity')]),
    size: new FormControl<EStockSize | null>(size ?? null),
  });


// --- Main Form Initialization ---
export const initializeIProductForm = (): FormGroup<IProductForm> =>
  new FormGroup<IProductForm>({
    id: new FormControl<number | null>(0),
    categoryIds: new FormControl<number[]>([]),
    categoryId: new FormControl<number|null>(null, [Validators.required]),
    collectionId: new FormControl<number | null>(null, Validators.required),
    categoryIdsList: new FormControl<Array<{ id: number; name: string }> | null>([]),
    name: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(70)]),
    isCustomSize: new FormControl<boolean | null>(false,),
    customSizeName: new FormControl<string | null>(''),
    color: new FormArray<FormControl<string | null>>([]),
    mrp: new FormControl<number | null>(null, [Validators.required, Validators.maxLength(10), patternWithMessage(/^\d+(\.\d{1,2})?$/, 'Enter a valid price')]),
    gender: new FormControl<GenderTypeEnum | null>(null, Validators.required),
    variants: new FormArray<FormGroup<IVariantForm>>([]),
    stocks: new FormArray<FormGroup<stocks>>([]),
    descriptions: new FormArray<FormGroup<IDescriptionForm>>([]),
    productBase64: new FormArray<FormControl<string | null>>([]),
    removeURL: new FormControl<string[]>([]),
  });

export interface IProductPagination extends IPaginationPayload {
  categoryId: number | null;
  gender: GenderTypeEnum | null;
}

export interface IProductResponseRoot{
    total:number;
    products:IProduct[]
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
    nextButtonText: 'Next: Gallery'
  },
  {
    step: 2,
    title: 'Product Gallery & Colors',
    shortTitle: 'Gallery',
    description: 'Upload stunning images and select beautiful colors for your product',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z',
    nextButtonText: 'Next: Variants'
  },
  {
    step: 3,
    title: 'Product Variants',
    shortTitle: 'Variants',
    description: 'Create different versions of your product (optional)',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    nextButtonText: 'Next: Stock'
  },
  {
    step: 4,
    title: 'Stock Management',
    shortTitle: 'Stock',
    description: 'Set inventory quantities for each size',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    nextButtonText: 'Next: Details'
  },
  {
    step: 5,
    title: 'Product Descriptions',
    shortTitle: 'Details',
    description: 'Add detailed descriptions for your product (optional)',
    icon: 'M4 6h16M4 12h16M4 18h7',
    nextButtonText: 'Create Product'
  }
];