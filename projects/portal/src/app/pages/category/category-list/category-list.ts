import { Component, inject, OnInit } from '@angular/core';
import { CategoryUpsert } from '../category-upsert/category-upsert';
import { MatDialog } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { initializePagInationPayload, IPaginationPayload } from '../../../core/interface/request/genericPayload';
import { ICategory } from '../../../core/interface/request/category.request';
import { ApiRoutes, EToastType, MConfirmationModalData, ToastService } from '@shared';
import { ICategoryResponse } from '../../../core/interface/response/category.response';

@Component({
  selector: 'app-category-list',
  imports: [],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList extends Base implements OnInit {

  public readonly dialog = inject(MatDialog);
  public payLoad: IPaginationPayload = initializePagInationPayload()
  public category: ICategory[] = []

  ngOnInit(): void {
    this.getCategoryData()
  }

  constructor(private toaster: ToastService) {
    super()
  }

  public openModel(id: number = 0) {
    const dialogRef = this.dialog.open(CategoryUpsert, {
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
      const modalData: MConfirmationModalData = {
        heading: 'Confirm Delete',
        body: 'Are you sure you want to delete this Category?',
        yesText: 'Yes',
        noText: 'No'
      };
      this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
        if (res) {
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
      })
    }
  }

}
