import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Base } from '@portal/core';
import { IorderResponseById } from '../../../core/interface/response/order.response';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { response } from 'express';
import { ApiRoutes } from '@shared';

@Component({
  selector: 'app-order-upsert',
  imports: [],
  templateUrl: './order-upsert.html',
  // styleUrl: './order-upsert.scss',
})
export class OrderUpsert extends Base implements OnInit{

  constructor(private activatedRoute:ActivatedRoute){
    super()
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((param: Params) => {
      if (param && param['id']) {
       this.getOrderById(+param['id'])
      }
    });
  }

  // GET ORDER BY ID  
  public getOrderById(id:number){
    this.httpGetPromise<IGenericResponse<IorderResponseById>>(ApiRoutes.ORDERS.GET_BY_ID(id)).then(response=>{
      console.log(response)
    }).catch(error=>{
      // handle error
    }) 
  }

}
