import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Base } from '@portal/core';
import { ICollection, ICollectionResponse } from '../../../core/interface/response/collection.response';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CollectionUpsert } from '../collection-upsert/collection-upsert';
import { intializepagInationPayload, IPaginationPayload } from '../../../core/interface/request/genericPayload';
import { ApiRoutes, ConfirmationDialog, EToastType, MConfirmationModalData, ToastService } from '@shared';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { response } from 'express';

@Component({
  selector: 'app-collection-list',
  imports: [],
  templateUrl: './collection-list.html',
  styleUrl: './collection-list.scss',
})
export class CollectionList extends Base implements OnInit {
  
  public readonly dialog = inject(MatDialog);
  public collectionList: WritableSignal<ICollection[]> = signal([]);
  public payLoad: IPaginationPayload = intializepagInationPayload()
  public collections: ICollection[] = []

  constructor(private toaster: ToastService) {
    super()
  }

  ngOnInit(): void {
    this.getAllCollections();
  }

  private getAllCollections() {
    this.httpPostPromise<IGenericResponse<ICollectionResponse>, IPaginationPayload>(ApiRoutes.COLLECTION.ALL, this.payLoad).then(response => {
      if (response) {
        if (response.data) {
          this.collectionList.set(response.data.collections);
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
        this.getAllCollections()
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
          this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.COLLECTION.GETBYID(id))
            .then(response => {
              if (response?.data) {
                this.toaster.show({
                  message: 'Collection deleted successfully',
                  duration: 3000,
                  type: EToastType.success
                });
                this.getAllCollections();
              }
            })
            .catch((error) => {
            });
        }
      })
    }
  }

}

