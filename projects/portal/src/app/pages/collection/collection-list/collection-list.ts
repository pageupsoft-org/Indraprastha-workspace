import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Base, handlePagination } from '@portal/core';

import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CollectionUpsert } from '../collection-upsert/collection-upsert';
import {
  initializePagInationPayload,
  IPaginationPayload,
} from '../../../core/interface/request/genericPayload';
import {
  ApiRoutes,
  ConfirmationDialog,
  EToastType,
  MConfirmationModalData,
  ToastService,
} from '@shared';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { PaginationController } from '../../../component/pagination-controller/pagination-controller';
import {
  createPaginationMetadata,
  PaginationControlMetadata,
} from '../../../core/interface/model/pagination-detail.model';
import { SearchBase } from '../../../core/base/search-base';
import { Observable } from 'rxjs';
import { SearchBar } from '../../../component/search-bar/search-bar';
import { ICollection, ICollectionResponse } from '../collection.model';

@Component({
  selector: 'app-collection-list',
  imports: [PaginationController, SearchBar],
  templateUrl: './collection-list.html',
  styleUrl: './collection-list.scss',
})
export class CollectionList
  extends SearchBase<IGenericResponse<ICollectionResponse>>
  implements OnInit
{
  public readonly dialog = inject(MatDialog);
  public collectionList: WritableSignal<ICollection[]> = signal([]);
  protected override payLoad: IPaginationPayload = initializePagInationPayload();
  public collections: ICollection[] = [];
  public paginationMetaData: PaginationControlMetadata = createPaginationMetadata();
  constructor(private toaster: ToastService) {
    super();
  }

  protected override getData(): Observable<IGenericResponse<ICollectionResponse>> {
    return this.httpPostObservable<IGenericResponse<ICollectionResponse>, IPaginationPayload>(
      ApiRoutes.COLLECTION.ALL,
      this.payLoad
    );
  }

  protected override dataLoadedHandler(response: IGenericResponse<ICollectionResponse>): void {
    if (response?.data && response.data?.total) {
      this.collectionList.set(response.data.collections);
      handlePagination(
        this.paginationMetaData,
        response.data.total,
        this.payLoad.pageIndex,
        this.payLoad.top
      );
    } else {
      this.collectionList.set([]);
    }
  }


  // Open PopUp
  public openModel(id: number = 0) {
    const dialogRef = this.dialog.open(CollectionUpsert, {
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

  //Delete Collection
  public deleteCollection(id: number) {
    if (id) {
      const modalData: MConfirmationModalData = {
        heading: 'Confirm Delete',
        body: 'Are you sure you want to delete this collection?',
        yesText: 'Yes',
        noText: 'No',
      };

      this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
        if (res) {
          this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.COLLECTION.GET_BY_ID(id))
            .then((response) => {
              if (response?.data) {
                this.toaster.show({
                  message: 'Collection deleted successfully',
                  duration: 3000,
                  type: EToastType.success,
                });
                this.search();
              }
            })
            .catch((error) => {});
        }
      });
    }
  }

}
