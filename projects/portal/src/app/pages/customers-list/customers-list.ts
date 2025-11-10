import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { customerResponse } from '../../core/interface/response/customer';
import { IGenericResponse } from '../../core/interface/response/responseGeneric';
import { PaginationController } from "../../component/pagination-controller/pagination-controller";
import { createPaginationMetadata, PaginationControlMetadata } from '../../core/interface/model/pagination-detail.model';
import { intializepagInationPayload, IPaginationPayload } from '../../core/interface/request/genericPayload';
import { Base, handlePagination } from '@portal/core';

@Component({
  selector: 'app-customers-list',
  imports: [PaginationController],
  templateUrl: './customers-list.html',
  styleUrl: './customers-list.scss',
})
export class CustomersList extends Base implements OnInit{
  public searchInput = new FormControl('');
  public payload: IPaginationPayload = intializepagInationPayload()
  public paginationMetadata: PaginationControlMetadata = createPaginationMetadata();

  ngOnInit(): void {
    this.getCustomers()
        handlePagination(
        this.paginationMetadata,
        100,
        1,
        10
      )
    console.log(this.payload)
  }
  private getCustomers(){  
    this.httpPostPromise<IGenericResponse<customerResponse>, IPaginationPayload>(this.apiRoutes.CUSTOMERS.CUSTOMER_ALL, this.payload).then(response=>{
      console.log(response)
    })
  }

}
