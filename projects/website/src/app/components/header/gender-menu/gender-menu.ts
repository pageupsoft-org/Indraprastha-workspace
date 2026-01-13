import {
  Component,
  effect,
  model,
  OnDestroy,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { IRequestProductMenu } from '../../../core/interface/model/header.model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { createUrlFromObject, GenderTypeEnum, initializePagInationPayload } from '@shared';
import {
  appRoutes,
  Category,
  Collection,
  IResponseGenderMenuRoot,
  ProductComboUrl,
  UtilityService,
} from '@website/core';

@Component({
  selector: 'app-gender-menu',
  imports: [FormsModule, RouterLink],
  templateUrl: './gender-menu.html',
  styleUrl: './gender-menu.scss',
})
export class GenderMenu implements OnInit, OnDestroy {
  public collectionList: WritableSignal<Collection[]> = signal([]);
  public categoryList: WritableSignal<Category[]> = signal([]);
  public productList: WritableSignal<ProductComboUrl[]> = signal([]);
  public aapRoutes = appRoutes;

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
    newlyAdded: false,
  };

  // this will hold the category id based on collection id,
  private categoryCollectionMap: WritableSignal<Map<number, Collection[]>> = signal(
    new Map<number, Collection[]>()
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

      this.productList.set(
        menuData.filter((val) => val.gender === this.genderType()).flatMap((val) => val.products)
      );

      // ✅ Update signals - Show all categories initially, collections will be shown on hover
      const allCategories = combinedCollections.flatMap(collection => collection.categories);
      this.categoryList.set(allCategories);
      
      // Initially show collections from first category if available
      if (allCategories.length > 0) {
        this.updateCollection(allCategories[0]);
      }
    });
  }

  ngOnInit(): void {
    const categoryCollectionMap = new Map<number, Collection[]>();
    this.utilityService.genderMenuData().forEach((menu: IResponseGenderMenuRoot) => {
      menu.collections.forEach((collection: Collection) => {
        collection.categories.forEach((category: Category) => {
          const existingCollections = categoryCollectionMap.get(category.id) || [];
          if (!existingCollections.find(c => c.id === collection.id)) {
            existingCollections.push(collection);
            categoryCollectionMap.set(category.id, existingCollections);
          }
        });
      });
    });
    this.categoryCollectionMap.set(categoryCollectionMap);
  }

  public updateCollection(category: Category) {
    const collections = this.categoryCollectionMap().get(category.id) || [];
    this.collectionList.set(collections);
  }

  public updatedCategory(menu: Category[]) {
    this.categoryList.set([]);
    this.categoryList.set(menu);
  }

  public clearGender(){
    this.genderType.update(() => '');
  }

  public getProductPageUrl(collection: Collection | null, category: Category | null): string {
    this.payloadGenderMenu.categoryIds = [];
    this.payloadGenderMenu.collectionIds = [];
    this.payloadGenderMenu.gender = GenderTypeEnum[this.genderType()];

    if (collection) {
      this.payloadGenderMenu.collectionIds.push(collection.id);
    }

    if (category) {
      this.payloadGenderMenu.categoryIds.push(category.id);
      const collections = this.categoryCollectionMap().get(category.id) || [];
      if (collections.length > 0) {
        this.payloadGenderMenu.collectionIds.push(collections[0].id);
      }
    }

    return createUrlFromObject(this.payloadGenderMenu, this.genderType());
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
      const collections = this.categoryCollectionMap().get(category.id) || [];
      if (collections.length > 0) {
        this.payloadGenderMenu.collectionIds.push(collections[0].id);
      }
    }
    this.router.navigate([createUrlFromObject(this.payloadGenderMenu, this.genderType())]);
    this.genderType.set('');
  }

  public routeToProductDetail(productId: number) {
    this.router.navigate([appRoutes.PRODUCT_DETAIL], {
      queryParams: {
        id: productId,
      },
    });
  }

  ngOnDestroy(): void {
    this.collectionList.set([]);
    this.categoryList.set([]);
  }
}
