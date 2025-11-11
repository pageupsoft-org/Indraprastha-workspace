import { Component, signal, WritableSignal } from '@angular/core';
import { Base } from '@portal/core';
import { ICollectionResponse } from '../../../core/interface/response/collection.response';

@Component({
  selector: 'app-collection-list',
  imports: [],
  templateUrl: './collection-list.html',
  styleUrl: './collection-list.scss',
})
export class CollectionList extends Base {

  public collectionList: WritableSignal<ICollectionResponse[]> = signal([]);

  constructor(){
    super();
    this.getAllCollections();
  }

  private getAllCollections(): void {
    // this.httpGetPromise<>
  }
}
