import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ApiRoutes,
  createUrlFromObject,
  GenderTypeEnum,
  getObjectFromUrl,
  httpPost,
  initializePagInationPayload,
  IRGeneric,
  PlatformService,
  ToastService,
} from '@shared';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Location } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  IRequestProductMenu,
  IResponseDynamicCatalogue,
  initializeIResponseDynamicCatalogue,
  appRoutes,
  WishlistService,
  ProductHeader,
} from '@website/core';
import { NoProductFound } from '../../core/component/no-product-found/no-product-found';

@Component({
  selector: 'app-dynamic-catalog',
  imports: [
    CommonModule,
    FormsModule,
    InfiniteScrollDirective,
    NgxSkeletonLoaderModule,
    NgTemplateOutlet,
    NoProductFound,
  ],
  templateUrl: './dynamic-catalog.html',
  styleUrl: './dynamic-catalog.scss',
})
export class DynamicCatalog implements AfterViewInit {
  @ViewChild('filterSidebar', { static: true }) filterSidebar!: ElementRef<HTMLDivElement>;
  @ViewChild('filterToggleBtn', { static: true }) filterToggleBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('sortOptions', { static: true }) sortOptions!: ElementRef<HTMLDivElement>;
  @ViewChild('sortArrow', { static: true }) sortArrow!: ElementRef<SVGElement>;

  @ViewChild('gridViewControls') gridViewControls!: ElementRef;
  @ViewChild('productGrid', { read: ElementRef }) grid!: ElementRef;

  filtersOpen = true;
  sortOpen = false;
  public currentCols: WritableSignal<number> = signal(6);

  public priceMax: WritableSignal<number> = signal(0);
  public selectedPrice: WritableSignal<number> = signal(0);

  public isShowLoading: WritableSignal<boolean> = signal(false);
  public payloadGenderMenu: WritableSignal<IRequestProductMenu> = signal({
    ...initializePagInationPayload(),
    gender: GenderTypeEnum.Women,
    collectionIds: [],
    categoryIds: [],
    colors: [],
    sizes: [],
    minPrice: 10000,
    maxPrice: 150000,
    newlyAdded: false,
  });
  public accumulatedProducts = signal<any[]>([]);
  public minLimit: WritableSignal<number> = signal(10000);
  public maxLimit: WritableSignal<number> = signal(150000);
  public finished = signal(false); // true when no more pages
  // public isLoading = signal(false); // prevents duplicate calls
  public selector: string = '.main-panel';

  public baseUrl: WritableSignal<string> = signal('');

  public dynamicData: WritableSignal<IResponseDynamicCatalogue> = signal(
    initializeIResponseDynamicCatalogue()
  );

  constructor(
    private platformService: PlatformService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private router: Router,
    private location: Location,
    private wishlistService: WishlistService
  ) {
    activatedRoute.url.subscribe((url: any) => {
      const { baseUrl, params } = getObjectFromUrl((url as Array<UrlSegment>)[0].path, [
        'collectionIds',
        'categoryIds',
        'colors',
        'sizes',
      ]);

      this.baseUrl.set(baseUrl);
      this.payloadGenderMenu.set(params as IRequestProductMenu);

      this.payloadGenderMenu.update((payload) => {
        return {
          ...payload,
          newlyAdded: this.baseUrl() == appRoutes.WHATS_NEW,
        };
      });

      this.getData();
    });
  }

  ngOnInit(): void {
    this.handleResize();

    if (this.platformService.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.setFiltersOpen(false);
  }


  public routeToProductDetail(productId: number) {
    const urlTree = this.router.createUrlTree([appRoutes.PRODUCT_DETAIL], {
      queryParams: { id: productId },
    });

    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }

  ngAfterViewInit(): void {
    // const gridViewControls = this.gridViewControls.nativeElement;
    // const grid = this.grid.nativeElement.querySelector('div');
  }

  onPriceChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    console.log(value);
    this.selectedPrice.set(value);
  }

  public changeGrid(cols: number): void {
    this.currentCols.set(cols);
    const gridDiv = this.grid.nativeElement;
    gridDiv.classList.remove('lg:grid-cols-3', 'lg:grid-cols-4', 'lg:grid-cols-6');
    gridDiv.classList.add(`lg:grid-cols-${cols}`);
  }

  public toggleSortOptions(event: MouseEvent): void {
    event.stopPropagation();
    this.sortOpen = !this.sortOpen;
    this.sortOptions.nativeElement.classList.toggle('hidden', !this.sortOpen);
    this.sortArrow.nativeElement.classList.toggle('rotate-180', this.sortOpen);
  }

  @HostListener('window:click')
  closeSortOptions(): void {
    if (this.sortOpen) {
      this.sortOpen = false;
      this.sortOptions.nativeElement.classList.add('hidden');
      this.sortArrow.nativeElement.classList.remove('rotate-180');
    }
  }

  @HostListener('window:resize')
  handleResize(): void {
    if (this.platformService.isBrowser) {
      const isMobile = window.innerWidth < 768;
      this.setFiltersOpen(!isMobile);
    }
  }

  public setFiltersOpen(isOpen: boolean): void {
    this.filtersOpen = isOpen;
    const sidebar = this.filterSidebar.nativeElement;
    const sidebarInner = sidebar.querySelector('div');

    if (isOpen) {
      sidebar.style.marginLeft = '0';
      sidebarInner?.classList.remove('opacity-0');
    } else {
      sidebar.style.marginLeft = '-15rem';
      sidebarInner?.classList.add('opacity-0');
    }
  }

  activeSections: Record<string, boolean> = {};

  toggleFilter(section: string): void {
    this.activeSections[section] = !this.activeSections[section];
  }

  isActive(section: string): boolean {
    return !!this.activeSections[section];
  }

  private getData() {
    // this.isLoading.set(true);
    this.isShowLoading.set(true);

    httpPost<IRGeneric<IResponseDynamicCatalogue>, IRequestProductMenu>(
      ApiRoutes.PRODUCT.MENU,
      this.payloadGenderMenu(),
      false
    ).subscribe({
      next: (res: IRGeneric<IResponseDynamicCatalogue>) => {
        if (res?.data && res.data.total) {
          const data = res?.data;
          if (this.payloadGenderMenu().pageIndex === 1) {
            this.dynamicData.set(data);

            this.priceMax.set(data.filter.maxPrice || this.priceMax());
            this.selectedPrice.set(data.filter.minPrice || this.selectedPrice());

            this.payloadGenderMenu.update((p) => ({
              ...p,
              minPrice: data.filter.minPrice || p.minPrice,
              maxPrice: data.filter.maxPrice || p.maxPrice,
            }));
          } else {
            this.dynamicData.update((old) => {
              const existing = old.products || [];
              const incoming = data.products || [];
              return {
                ...old,
                products: [...existing, ...incoming],
                filter: data.filter || old.filter,
              };
            });
          }

          this.dynamicData.update((data) => {
            return {
              ...data,
              filter: {
                ...data.filter,
                category: data.filter.category.map((c) => ({
                  ...c,
                  isSelected: this.payloadGenderMenu().categoryIds.includes(c.id),
                })),
              },
            };
          });
        } else {
          this.dynamicData.set(initializeIResponseDynamicCatalogue());

          if (this.payloadGenderMenu().pageIndex == 1) {
            this.setFiltersOpen(false);
          }
        }
        this.isShowLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isShowLoading.set(false);
      },
    });
  }

  public onScrollDown() {
    if (
      this.isShowLoading() ||
      this.finished() ||
      (this.payloadGenderMenu().pageIndex == 1 && !this.dynamicData().products.length)
    ) {
      return;
    }
    // increment page
    this.payloadGenderMenu.update((p) => ({
      ...p,
      pageIndex: (p.pageIndex || 1) + 1,
    }));

    // fetch next page
    this.getData();
  }

  onMinChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    const current = this.payloadGenderMenu();

    // Ensure min does not exceed max
    const newMin = Math.min(value, current.maxPrice - 1000);

    this.payloadGenderMenu.set({
      ...current,
      minPrice: newMin,
    });
  }

  onMaxChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    const current = this.payloadGenderMenu();

    // Ensure max does not go below min
    const newMax = Math.max(value, current.minPrice + 1000);

    this.payloadGenderMenu.set({
      ...current,
      maxPrice: newMax,
    });
  }

  getRangeStyle() {
    const current = this.payloadGenderMenu();
    return {
      left:
        ((current.minPrice - this.minLimit()) / (this.maxLimit() - this.minLimit())) * 100 + '%',
      right:
        100 -
        ((current.maxPrice - this.minLimit()) / (this.maxLimit() - this.minLimit())) * 100 +
        '%',
    };
  }

  public search() {
    const categoryIds: number[] = this.dynamicData()
      .filter.category.filter((category) => category.isSelected)
      .map((category) => category.id);

    const colors: string[] = this.dynamicData()
      .filter.color.filter((color) => color.isSelected)
      .map((color) => color.name);

    this.payloadGenderMenu().categoryIds = categoryIds;
    this.payloadGenderMenu().colors = colors;
    this.getData();
    const newUrl = createUrlFromObject(this.payloadGenderMenu(), this.baseUrl());
    this.location.go(newUrl);
  }

  public toggleWishList(event: any, item: ProductHeader) {
    this.wishlistService.toggleWishList<ProductHeader>(event, item, 'isWishList', 'id');
  }
}
