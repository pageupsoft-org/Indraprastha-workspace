import { Component, signal, WritableSignal } from '@angular/core';
import { Collection } from '../../core/services/collection';
import { GenderTypeEnum } from '@shared';
import { IResponseCollection } from '../../core/interface/response/collection.response';
import { NoProductFound } from "../../core/component/no-product-found/no-product-found";

@Component({
  selector: 'app-collections',
  imports: [NoProductFound],
  providers: [Collection],
  templateUrl: './collections.html',
  styleUrl: './collections.scss',
})
export class Collections {
  public collectionList: WritableSignal<IResponseCollection[]> = signal([]);
  
  constructor(private collectionService: Collection) {
    this.collectionService.getCollection(GenderTypeEnum.Both, this.collectionList);
  }
}
