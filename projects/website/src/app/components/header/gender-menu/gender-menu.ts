import {
  Component,
  effect,
  input,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ICategory } from '../../../core/interface/model/header.model';
import { CategoryData, CollectionData } from '../header.data';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UtilityService } from '../../../core/services/utility-service';
import {
  Category,
  Collection,
  IResponseGenderMenuRoot,
} from '../../../core/interface/response/gender-menu.response';
import { GenderTypeEnum } from '@shared';

@Component({
  selector: 'app-gender-menu',
  imports: [FormsModule],
  templateUrl: './gender-menu.html',
  styleUrl: './gender-menu.scss',
})
export class GenderMenu implements OnInit, OnDestroy {
  public collectionList: WritableSignal<Collection[]> = signal([]);
  public categoryList: WritableSignal<Category[]> = signal([]);

  public genderType = input.required<GenderTypeEnum | ''>();

  public selectedCollection: WritableSignal<string> = signal('');

  constructor(private router: Router, private utilityService: UtilityService) {
    effect(() => {
      if (!this.genderType()) return;

      // 🧹 Reset lists
      this.collectionList.set([]);
      this.categoryList.set([]);

      const menuData = this.utilityService.genderMenuData();

      // 🧩 Filter collections based on gender
      const selectedGender = menuData.find(
        (menu: IResponseGenderMenuRoot) => menu.gender === this.genderType()
      );
      let combinedCollections = selectedGender ? [...selectedGender.collections] : [];

      const bothGender = menuData.find(
        (menu: IResponseGenderMenuRoot) => menu.gender === GenderTypeEnum.Both
      );

      if (bothGender) {
        combinedCollections = [...combinedCollections, ...bothGender.collections];
      }

      // ✅ Update signals
      this.collectionList.set(combinedCollections);
      if (combinedCollections.length > 0) {
        this.categoryList.set(combinedCollections[0].categories);
      }
    });
  }

  ngOnInit(): void {}

  public updatedCategory(menu: Category[]) {
    this.categoryList.set([]);
    this.categoryList.set(menu);
  }

  public filterProduct(slug: string) {
    // this.selectedCollection.set(
    //   this.selectedCollection() == '' ? this.collectionList()[0].slug : this.selectedCollection()
    // );
    // this.router.navigate([this.genderType(), this.selectedCollection(), slug]);
  }

  ngOnDestroy(): void {
    this.collectionList.set([]);
    this.categoryList.set([]);
  }
}
