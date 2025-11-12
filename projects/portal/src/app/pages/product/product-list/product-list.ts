import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductUpsert } from '../product-upsert/product-upsert';
import { RouterLink } from "@angular/router";
import { Base } from '@portal/core';
import { intializepagInationPayload } from '../../../core/interface/request/genericPayload';
import { IProductPagination } from '../../../core/interface/request/product.request';
import { EGender } from '../../../core/enum/gender.enum';
import { IGenericResponse } from '../../../core/interface/response/responseGeneric';

import { ApiRoutes } from '@shared';
import { response } from 'express';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList extends Base implements OnInit{
  public readonly dialog = inject(MatDialog);
  public payLoad: IProductPagination = {
      ...intializepagInationPayload(),
      categoryId:null,
      gender:null,
    };

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  constructor(){
    super()
  }

  // Open PopUp
  public openModel(id: number = 0) {
    const dialogRef = this.dialog.open(ProductUpsert, {
      width: '80%',
      maxWidth: '900px',
      height: '90%',
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
      }
    });
  }

  // Product List
  // public getProductData(){
  //   this.httpPostPromise<IGenericResponse<IProductResponse>, IProductPagination>(ApiRoutes.PRODUCT.ALL, this.payLoad).then(response=>{
  //     if(response){
  //     console.log(response, "product data")
  //     }
  //   }).catch(error=>{
  //     //handle error
  //   })
  // }

  // Delete Product
  public deleteProduct(id:number){
   this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.PRODUCT.GETBYID(id)).then(response=>{
    console.log(response)
   })
  }
  
}
