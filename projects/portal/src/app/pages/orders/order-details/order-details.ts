import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Base } from '@portal/core';
import { IorderResponseById } from '../../../core/interface/response/order.response';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { response } from 'express';
import { ApiRoutes, EOrderStatus, MConfirmationModalData, MStringEnumToArray, stringEnumToArray } from '@shared';
import { CommonModule, NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IChangeStatusForm, initializeIChangeStatusForm, IUpdateStatusRequest } from '../../../core/interface/request/order.request';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, NgClass, ReactiveFormsModule],
  templateUrl: './order-details.html',
  // styleUrl: './order-upsert.scss',
})

export class OrderDetails extends Base implements OnInit {

  public changeStatusForm: FormGroup<IChangeStatusForm> = initializeIChangeStatusForm()
  public statusList = ['InProcess', 'InShipment', 'Placed', 'Cancel', 'Complete'];
  public statusValue: MStringEnumToArray[] = stringEnumToArray(EOrderStatus)
  public orderStatusIndex = 0;
  public progressWidth = 0;
  public orderStatus = 'InProcess'

  constructor(private activatedRoute: ActivatedRoute) {
    super()
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((param: Params) => {
      if (param && param['id']) {
        this.getOrderById(+param['id'])
      }
    });
    this.orderStatusIndex = this.statusList.indexOf(this.orderStatus);
    this.progressWidth = (this.orderStatusIndex / (this.statusList.length - 1)) * 100;
  }

  // GET ORDER BY ID  
  public getOrderById(id: number) {
    this.httpGetPromise<IGenericResponse<IorderResponseById>>(ApiRoutes.ORDERS.GET_BY_ID(id)).then(response => {
    }).catch(error => {
      // handle error
    })
  }

  public movestatusplace(newStatus) {
    this.orderStatus = newStatus;

    this.orderStatusIndex = this.statusList.indexOf(newStatus);
    this.progressWidth = (this.orderStatusIndex / (this.statusList.length - 1)) * 100;
  }

  public updateStatus() {

    const modalData: MConfirmationModalData = {
      heading: 'Confirm Delete',
      body: 'Are you sure you want change order status?',
      yesText: 'Yes',
      noText: 'No'
    };
    this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
      if (res) {
        this.movestatusplace(this.changeStatusForm.controls.orderStatus.value)

        const payload = {
          id: this.changeStatusForm.controls.id.value,
          orderStatus: this.changeStatusForm.controls.orderStatus.value
        }
        this.httpPostPromise<IGenericResponse<boolean>, IUpdateStatusRequest>(ApiRoutes.ORDERS.CHANGE_STATUS, payload as IUpdateStatusRequest).then(response => {
          if (response) {
            if (response.data) {
              // this.movestatusplace() db store status call and display
            }
          }
        }).catch(error => {
          // handle error
        })
      }
    })
  }

}
