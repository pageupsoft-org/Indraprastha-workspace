import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoryUpsert } from '../category-upsert/category-upsert';
import { MatDialog } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import {
  initializePagInationPayload,
  IPaginationPayload,
} from '../../../core/interface/request/genericPayload';
import { ICategory } from '../../../core/interface/request/category.request';
import { ApiRoutes, EToastType, MConfirmationModalData, ToastService } from '@shared';
import { ICategoryResponse } from '../../../core/interface/response/category.response';
import { PaginationController } from '../../../component/pagination-controller/pagination-controller';
import {
  createPaginationMetadata,
  PaginationControlMetadata,
} from '../../../core/interface/model/pagination-detail.model';
import { handlePagination } from '@portal/core';
import { SearchBase } from '../../../core/base/search-base';
import { Observable } from 'rxjs';
import { SearchBar } from '../../../component/search-bar/search-bar';

@Component({
  selector: 'app-category-list',
  imports: [PaginationController, SearchBar],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList
  extends SearchBase<IGenericResponse<ICategoryResponse>>
  implements OnInit
{
  public readonly dialog = inject(MatDialog);
  public payLoad: IPaginationPayload = initializePagInationPayload();
  // public category: ICategory[] = []
  public category: WritableSignal<ICategory[]> = signal([]);
  public paginationMetaData: PaginationControlMetadata = createPaginationMetadata();

  constructor(private toaster: ToastService) {
    super();
  }

  protected override getData(): Observable<IGenericResponse<ICategoryResponse>> {
    return this.httpPostObservable<IGenericResponse<ICategoryResponse>, IPaginationPayload>(
      ApiRoutes.CATEGORY.GET,
      this.payLoad
    );
  }

  protected override dataLoadedHandler(response: IGenericResponse<ICategoryResponse>): void {
    if (response?.data && response.data?.total) {
      this.category.set(response.data.categories);
      handlePagination(
        this.paginationMetaData,
        response.data.total,
        this.payLoad.pageIndex,
        this.payLoad.top
      );
    } else {
      this.category.set([]);
    }
  }
  public searchText(searchText: string) {
    this.payLoad.search = searchText;
    this.searchString$.next(searchText);
    this.payLoad.pageIndex = 1;
    this.search();
  }


  public openModel(id: number = 0) {
    const dialogRef = this.dialog.open(CategoryUpsert, {
      width: '80%',
      maxWidth: '900px',
      data: {
        id: id,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.search();
      }
    });
  }

  public deleteCategory(id: number) {
    if (id) {
      const modalData: MConfirmationModalData = {
        heading: 'Confirm Delete',
        body: 'Are you sure you want to delete this Category?',
        yesText: 'Yes',
        noText: 'No',
      };
      this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
        if (res) {
          this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.CATEGORY.GET_BY_ID(id))
            .then((response) => {
              if (response) {
                if (response.data) {
                  this.toaster.show({
                    message: 'Delete Successful',
                    duration: 3000,
                    type: EToastType.success,
                  });
                  this.search();
                }
              }
            })
            .catch((error) => {
              // handle error
            });
        }
      });
    }
  }

  public topChange(top: number) {
    this.payLoad.top = top;
    this.payLoad.pageIndex = 1;
    this.search();
  }

  public pageChange(pageIndex: number) {
    this.payLoad.pageIndex = pageIndex;
    this.search();
  }
}
