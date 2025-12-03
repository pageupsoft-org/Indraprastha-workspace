import {
  Component,
  effect,
  input,
  model,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { IRequestProductMenu } from '../../../core/interface/model/header.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { createUrlFromObject, GenderTypeEnum, initializePagInationPayload} from '@shared';
import { Category, Collection, IResponseGenderMenuRoot, UtilityService } from '@website/core';

@Component({
  selector: 'app-gender-menu',
  imports: [FormsModule],
  templateUrl: './gender-menu.html',
  styleUrl: './gender-menu.scss',
})
export class GenderMenu implements OnInit, OnDestroy {
  public collectionList: WritableSignal<Collection[]> = signal([]);
  public categoryList: WritableSignal<Category[]> = signal([]);

  // public genderType = input.required<GenderTypeEnum | ''>();
  public genderType = model.required<GenderTypeEnum | ''>();

  private payloadGenderMenu: IRequestProductMenu = {
    ...initializePagInationPayload(),
    gender: GenderTypeEnum.Men,
    collectionIds: [],
    categoryIds: [],
    colors: [],
    sizes: [],
    minPrice: 0,
    maxPrice: 0,
    newlyAdded: false
  };

  // this will hold the collection id based on category id,
  // private categoriesCollectionMap: Map<number, number> = new Map<number, number>();
  private categoriesCollectionMap: WritableSignal<Map<number, Collection>> = signal(
    new Map<number, Collection>()
  );

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

  ngOnInit(): void {
    const map = new Map<number, Collection>();
    this.utilityService.genderMenuData().forEach((menu: IResponseGenderMenuRoot) => {
      menu.collections.forEach((collection: Collection) => {
        collection.categories.forEach((category: Category) => {
          map.set(category.id, collection);
        });
      });
    });
    this.categoriesCollectionMap.set(map);
  }

  public updatedCategory(menu: Category[]) {
    this.categoryList.set([]);
    this.categoryList.set(menu);
  }

  public openProductPage(collection: Collection | null, category: Category | null) {
    this.payloadGenderMenu.categoryIds = [];
    this.payloadGenderMenu.collectionIds = [];
    this.payloadGenderMenu.gender = GenderTypeEnum[this.genderType()];

    if (collection) {
      this.payloadGenderMenu.collectionIds.push(collection.id);
    }

    if (category) {
      this.payloadGenderMenu.categoryIds.push(category.id);
      this.payloadGenderMenu.collectionIds.push(
        this.categoriesCollectionMap().get(category.id)?.id ?? 0
      );      
    }
    this.router.navigate([createUrlFromObject(this.payloadGenderMenu, this.genderType())]);
    this.genderType.set('');
  }

  ngOnDestroy(): void {
    this.collectionList.set([]);
    this.categoryList.set([]);
  }
}
