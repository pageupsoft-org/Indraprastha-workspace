import {
  Component,
  computed,
  effect,
  inject,
  model,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
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
  GenderTypeEnum,
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
import { Observable, forkJoin } from 'rxjs';
import { SearchBar } from '../../../component/search-bar/search-bar';
import { ICollection, ICollectionResponse } from '../collection.model';
import { ICategory, ICategoryResponse } from '../../category/category.model';
import { CategoryUpsert } from '../../category/category-upsert/category-upsert';

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
  public categories: WritableSignal<ICategory[]> = signal([]);
  protected override payLoad: IPaginationPayload = initializePagInationPayload();
  public collections: ICollection[] = [];
  public paginationMetaData: PaginationControlMetadata = createPaginationMetadata();
  public activeView: 'collections' | 'categories' | 'unified' = 'unified';
  private categoryPayload: IPaginationPayload = {
    ...initializePagInationPayload(),
  };
  public readonly GenderTypeEnum = GenderTypeEnum;
  public genderFilter: WritableSignal<GenderTypeEnum> = signal(GenderTypeEnum.Both);

  public filteredCollectionList = computed(() => {
    const gender = this.genderFilter();

    if (gender === GenderTypeEnum.Both) {
      return this.collectionList();
    }

    return this.collectionList().filter(
      (collection) => collection.gender?.toLowerCase() === gender.toLowerCase(),
    );
  });

  public filteredCategoryList = computed<ICategory[]>(() => {
    const gender = this.genderFilter();

    if (gender === GenderTypeEnum.Both) {
      return this.categories();
    }

    return this.categories().filter((category) => {
      const parentCollection = this.collectionList().find(
        (collection) =>
          collection.name === category.collectionName &&
          collection.gender?.toLowerCase() === gender.toLowerCase(),
      );

      return !!parentCollection;
    });
  });

  public defaultSearchText: WritableSignal<string | null> = signal(null);

  constructor(private toaster: ToastService) {
    super();
    this.payLoad.isPaginate = false;
    this.categoryPayload.isPaginate = false;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadCategories();
  }

  protected override getData(): Observable<IGenericResponse<ICollectionResponse>> {
    return this.httpPostObservable<IGenericResponse<ICollectionResponse>, IPaginationPayload>(
      ApiRoutes.COLLECTION.ALL,
      this.payLoad,
    );
  }

  protected override dataLoadedHandler(response: IGenericResponse<ICollectionResponse>): void {
    if (response?.data && response.data?.total) {
      this.collectionList.set(response.data.collections);
      handlePagination(
        this.paginationMetaData,
        response.data.total,
        this.payLoad.pageIndex,
        this.payLoad.top,
      );
    } else {
      this.collectionList.set([]);
    }
  }

  private loadCategories(): void {
    this.httpPostObservable<IGenericResponse<ICategoryResponse>, IPaginationPayload>(
      ApiRoutes.CATEGORY.GET,
      this.categoryPayload,
    ).subscribe({
      next: (response) => {
        if (response?.data && response.data?.categories) {
          this.categories.set(response.data.categories);
        } else {
          this.categories.set([]);
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories.set([]);
      },
    });
  }

  public setActiveView(view: 'collections' | 'categories' | 'unified'): void {
    this.payLoad.search = '';
    this.categoryPayload.search = '';
    this.activeView = view;
    
    if(this.defaultSearchText()){
      this.loadCategories();
      this.search();
    }

    this.defaultSearchText.update(() => '');
  }

  public setGenderFilter(gender: GenderTypeEnum): void {
    this.genderFilter.update(() => gender);
  }

  // Open Collection PopUp
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
        this.loadCategories(); // Refresh categories as well
      }
    });
  }

  // Open Category PopUp
  public openCategoryModel(id: number = 0) {
    const dialogRef = this.dialog.open(CategoryUpsert, {
      width: '80%',
      maxWidth: '900px',
      data: {
        id: id,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadCategories(); // Refresh categories
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
                this.loadCategories(); // Refresh categories as well
              }
            })
            .catch((error) => {});
        }
      });
    }
  }

  //Delete Category
  public deleteCategory(id: number) {
    if (id) {
      const modalData: MConfirmationModalData = {
        heading: 'Confirm Delete',
        body: 'Are you sure you want to delete this category?',
        yesText: 'Yes',
        noText: 'No',
      };

      this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
        if (res) {
          this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.CATEGORY.GET_BY_ID(id))
            .then((response) => {
              if (response?.data) {
                this.toaster.show({
                  message: 'Category deleted successfully',
                  duration: 3000,
                  type: EToastType.success,
                });
                this.loadCategories(); // Refresh categories
              }
            })
            .catch((error) => {});
        }
      });
    }
  }

  public override searchText(searchText: string): void {
    this.defaultSearchText.update(() => searchText);
    if (this.activeView === 'categories') {
      this.categoryPayload.search = searchText;
      this.searchString$.next(searchText);
      this.categoryPayload.pageIndex = 1;
      this.loadCategories();
    } else {
      this.payLoad.search = searchText;
      this.searchString$.next(searchText);
      this.payLoad.pageIndex = 1;
      super.search();
    }
  }
}
