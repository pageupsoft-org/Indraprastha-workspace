import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Base, handlePagination } from '@portal/core';
import { ICollection, ICollectionResponse } from '../../../core/interface/response/collection.response';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CollectionUpsert } from '../collection-upsert/collection-upsert';
import { initializePagInationPayload, IPaginationPayload } from '../../../core/interface/request/genericPayload';
import { ApiRoutes, ConfirmationDialog, EToastType, MConfirmationModalData, ToastService } from '@shared';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { response } from 'express';
import { PaginationController } from "../../../component/pagination-controller/pagination-controller";
import { createPaginationMetadata, PaginationControlMetadata } from '../../../core/interface/model/pagination-detail.model';

@Component({
  selector: 'app-collection-list',
  imports: [PaginationController],
  templateUrl: './collection-list.html',
  styleUrl: './collection-list.scss',
})
export class CollectionList extends Base implements OnInit {
  
  public readonly dialog = inject(MatDialog);
  public collectionList: WritableSignal<ICollection[]> = signal([]);
  public payLoad: IPaginationPayload = initializePagInationPayload()
  public collections: ICollection[] = []
  public paginationMetaData : PaginationControlMetadata = createPaginationMetadata()
  constructor(private toaster: ToastService) {
    super()
  }

  ngOnInit(): void {
    this.getCollectionsData();
  }

  private getCollectionsData() {
    this.httpPostPromise<IGenericResponse<ICollectionResponse>, IPaginationPayload>(ApiRoutes.COLLECTION.ALL, this.payLoad).then(response => {
      if (response) {
        if (response.data) {
          this.collectionList.set(response.data.collections);
          handlePagination(
            this.paginationMetaData,
            response.data.total,
            this.payLoad.pageIndex,
            this.payLoad.top,
            
          )
        }
      }
    })
  }

  // Open PopUp
  public openModel(id: number = 0) {
    console.log(id)
    const dialogRef = this.dialog.open(CollectionUpsert, {
      width: '80%',
      maxWidth: '900px',
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getCollectionsData()
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
        noText: 'No'
      };

      this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
        if (res) {
          this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.COLLECTION.GET_BY_ID(id))
            .then(response => {
              if (response?.data) {
                this.toaster.show({
                  message: 'Collection deleted successfully',
                  duration: 3000,
                  type: EToastType.success
                });
                this.getCollectionsData();
              }
            })
            .catch((error) => {
            });
        }
      })
    }
  }

  public topChange(top: number) {
    console.log("Top:", top);
    this.payLoad.top = top;
    this.getCollectionsData();
  }

  public pageChange(pageIndex: number) {
    console.log("Page Index:", pageIndex);
    this.payLoad.pageIndex = pageIndex;
    this.getCollectionsData();
  }

}

