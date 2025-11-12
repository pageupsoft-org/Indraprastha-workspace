import { Component, inject, OnInit } from '@angular/core';
import { Base } from '../../../core/base/base';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeList } from '../../employee/employee-list/employee-list';
import { description, IProductForm, stocks, variants } from '../../../core/interface/request/product.request';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { ApiRoutes, EDiscriptionType, IRGeneric, MStringEnumToArray, stringEnumToArray } from '@shared';
import { IGenericComboResponse } from '../../../core/interface/response/banner.response';
import { EGender } from '../../../core/enum/gender.enum';
import { CommonModule } from '@angular/common';
import { EStockSize } from '../../../../../../shared/src/lib/enum/size.enum';


@Component({
  selector: 'app-product-upsert',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-upsert.html',
  styleUrl: './product-upsert.scss',
})
export class ProductUpsert extends Base implements OnInit {

  public Categorycombo: IGenericComboResponse[] = [];
  public genders: MStringEnumToArray[] = stringEnumToArray(EGender);
  public discriptionTypeEnum: MStringEnumToArray[] = stringEnumToArray(EDiscriptionType);
  public StockSize: MStringEnumToArray[] = stringEnumToArray(EStockSize);
  public ShowDiscription: boolean = false;
  public readonly EDiscriptionType = EDiscriptionType;
  public productForm = new FormGroup<IProductForm>({
    id: new FormControl(0),
    categoryIds: new FormControl(),
    name: new FormControl(''),
    isCustomSize: new FormControl(false),
    customSizeName: new FormControl(''),
    color: new FormControl(),
    mrp: new FormControl(0),
    gender: new FormControl(null),
    stocks: new FormArray<FormGroup<stocks>>([this.createProductStock()]),
    descriptions: new FormArray<FormGroup<description>>([this.createDiscription()]),
    productBase64: new FormControl(),
    removeURL: new FormControl(),
    variants: new FormArray<FormGroup<variants>>([this.createVariant()]),
    jsonDescription: new FormArray<FormGroup<{ key: FormControl<string | null>, value: FormControl<string | null> }>>([this.createJsonDescritp()])
  })

  ngOnInit(): void {
    this.getCategoryCombo();
  }

  // public onCancel() {
  //   this.dialogRef.close();
  // }

  constructor() {
    super()
  }

  // GET CATEGORY COMBO
  private getCategoryCombo() {
    this.httpGetPromise<IRGeneric<IGenericComboResponse[]>>(ApiRoutes.CATEGORY.GET_COMBO)
      .then((response) => {
        console.log(response);
        if (response) {
          if (response.data) {
            this.Categorycombo = response.data;
          }
        }
      })
      .catch((error) => { });
  }

  // GET PRODUCTS
  // public getProducts() {
  //   this.httpPostPromise<IGenericResponse<IEmployeeResponse>, IPaginationPayload>(ApiRoutes.EMPLOYEE.GET, this.payLoad).then(response => {
  //     if (response) {
  //       if (response.data) {
  //         this.employees = response.data.employees;
  //       }
  //     }
  //   }).catch((error) => {
  //   //   handel error
  //   })
  // } 

  public onProductSubmit() {
    console.log(this.productForm.value)
  }

  public createVariant(): FormGroup<variants> {
    const varient = new FormGroup<variants>({
      id: new FormControl<number | null>(null),
      productId: new FormControl<number | null>(null),
      name: new FormControl<string | null>(null),
      description: new FormControl<string | null>(null),
      mrp: new FormControl<number | null>(null),
      stocks: new FormGroup({
        quantity: new FormControl<number | null>(null)
      }),
      variantBase64: new FormControl<string | null>(null)
    });
    return varient;
  }

  public addVariant() {
    const variantForm = this.createVariant();
    this.productForm.controls.variants.push(variantForm);
  }

  public createProductStock(): FormGroup<stocks> {
    const stock = new FormGroup<stocks>({
      quantity: new FormControl<number | null>(null),
      size: new FormControl<EStockSize | null>(null),
    });
    return stock;
  }

  public addStock() {
    const stock = this.createProductStock();
    this.productForm.controls.stocks.push(stock);
  }

  public createDiscription(): FormGroup<description> {
    const description = new FormGroup<description>({
      header: new FormControl<string | null>(null),
      descriptionType: new FormControl<EDiscriptionType | null>(null),
      description: new FormControl<string | null>(null),
      shortDescription: new FormControl<string | null>(null),
    });
    return description;
  }

  public addeDiscription() {
    const description = this.createDiscription();
    this.productForm.controls.descriptions.push(description);
  }

  public createJsonDescritp(): FormGroup<{ key: FormControl<string | null>, value: FormControl<string | null> }> {
    return new FormGroup({
      key: new FormControl<string | null>(null),
      value: new FormControl<string | null>(null)
    });
  }

  //  public onColorChange(event: Event) {
  //   const color = (event.target as HTMLInputElement).value;
  //   this.productForm.patchValue({ color });
  // }

  public setFiled(form: any) {
    const descType = form.get('descriptionType').value;

    if(descType == EDiscriptionType.Json){
      this.productForm.controls.jsonDescription.push(this.createJsonDescritp());
    }else{
      this.productForm.controls.jsonDescription.clear();
    }
    
    
    // const discriptionValue = this.productForm.controls.descriptions.controls.at(index)?.value.descriptionType
    // if (discriptionValue === EDiscriptionType.Json) {
    //   this.ShowDiscription = true
    //   this.createJsonDescritp()
    // }
    // else {
    //   this.ShowDiscription = false;
    // }
  }








}
