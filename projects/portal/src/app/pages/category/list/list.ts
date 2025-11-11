import { Component, inject, OnInit } from '@angular/core';
import { Upsert } from '../upsert/upsert';
import { MatDialog } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/responseGeneric';
import { intializepagInationPayload, IPaginationPayload } from '../../../core/interface/request/genericPayload';
import { ICategory } from '../../../core/interface/request/category';
import { ApiRoutes, EToastType, ToastService } from '@shared';
import { ICategoryResponse } from '../../../core/interface/response/category';

@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List extends Base implements OnInit {

  public readonly dialog = inject(MatDialog);
  public payLoad: IPaginationPayload = intializepagInationPayload()
  public category: ICategory[] = []

  ngOnInit(): void {
    this.getCategoryData()
  }

  constructor(private toaster: ToastService) {
    super()
  }

  public openModel(id: number = 0) {
    const dialogRef = this.dialog.open(Upsert, {
      width: '80%',
      maxWidth: '900px',
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getCategoryData()
      }
    });
  }

  public getCategoryData() {
    this.httpPostPromise<IGenericResponse<ICategoryResponse>, IPaginationPayload>(ApiRoutes.CATEGORY.GET, this.payLoad).then(response => {
      if (response) {
        if (response.data) {
          this.category = response.data.categories
        }
      }
    }).catch(error => {
      // handel error
    })
  }

  public deleteCategory(id: number) {
    if (id) {
      this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.CATEGORY.GETBYID(id)).then(response => {
        console.log(response)
        if (response) {
          if (response.data) {
            this.toaster.show({ message: 'Delete Successful', duration: 3000, type: EToastType.success });
            this.getCategoryData()
          }
        }
      })
        .catch((error) => {
          // handle error
        })
    }
  }

  

}
