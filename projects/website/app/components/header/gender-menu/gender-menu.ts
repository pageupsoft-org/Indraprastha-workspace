import { Component, effect, input, Signal, signal, WritableSignal } from '@angular/core';
import { ICategory } from '../../../core/interface/model/header.model';
import { CategoryData, CollectionData } from '../header.data';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gender-menu',
  imports: [FormsModule],
  templateUrl: './gender-menu.html',
  styleUrl: './gender-menu.scss',
})
export class GenderMenu {
  public categoryList: Signal<ICategory[]> = signal(CategoryData);
  public collectionList: Signal<ICategory[]> = signal(CollectionData);

  public genderType = input<'men' | 'women'|''>('women');

  public selectedCollection: WritableSignal<string> = signal('');

  constructor(private router: Router) {
    // console.log(this.categoryList());


   effect(() => {
      console.log(`The current activeGender is: ${this.genderType()}`);
    });
  }

  public filterProduct(slug: string) {
    this.selectedCollection.set(
      this.selectedCollection() == '' ? this.collectionList()[0].slug : this.selectedCollection()
    );

    this.router.navigate([this.genderType(), this.selectedCollection(), slug]);
  }
}
