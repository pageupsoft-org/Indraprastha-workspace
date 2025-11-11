import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  input,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { RNewArrivals } from '../../../core/interface/response/newArrival.response';
import { NewArrivalProductCard } from '../../../components/new-arrival-product-card/new-arrival-product-card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDetailDialog } from '../../../components/product-detail-dialog/product-detail-dialog';
import {
  ApiRoutes,
  DashboardProductTypeStringEnum,
  httpPost,
  intializepagInationPayload,
  IRGeneric,
  PlatformService,
} from '@shared';
import { IDashboadRequest } from './dashboard.request';
import { DashboardResponseRoot } from './dashboard.response';

@Component({
  selector: 'app-product-slider',
  imports: [NewArrivalProductCard, MatDialogModule],
  templateUrl: './product-slider.html',
  styleUrl: './product-slider.scss',
})
export class ProductSlider implements AfterViewInit {
  @ViewChild('sliderTrack', { static: false }) sliderTrack!: ElementRef<HTMLDivElement>;
  @ViewChild('prevBtn', { static: false }) prevBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('nextBtn', { static: false }) nextBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('cardsContainer', { static: false }) cardsContainer!: ElementRef<HTMLDivElement>;

  public productType = input.required<DashboardProductTypeStringEnum>();
  public title = input.required<string>();

  public productList: WritableSignal<DashboardResponseRoot> = signal('' as any);

  public totalCards: WritableSignal<number> = signal(this.productList()?.products?.length);
  public currentCardIndex: WritableSignal<number> = signal(0);

  private payload: IDashboadRequest = {
    ...intializepagInationPayload(),
    type: DashboardProductTypeStringEnum.NewArrival,
  };

  constructor(private platformService: PlatformService, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.payload.type = this.productType();
    this.getDashboardProduct();
  }

  ngAfterViewInit() {
    if (this.platformService.isBrowser) {
      const cards = Array.from(this.sliderTrack.nativeElement.children) as HTMLElement[];

      this.totalCards.set(cards.length);
      this.updateSlider();
    }
  }

  private updateSlider() {
    const sliderTrack = this.sliderTrack.nativeElement;
    const prevBtn = this.prevBtn.nativeElement;
    const nextBtn = this.nextBtn.nativeElement;
    const cards = Array.from(this.sliderTrack.nativeElement.children) as HTMLElement[];

    // Determine number of visible cards
    let visibleCards = 1;
    if (window.innerWidth >= 1024) {
      visibleCards = 4;
    } else if (window.innerWidth >= 640) {
      visibleCards = 2;
    }

    const maxCardIndex = this.totalCards() - visibleCards;
    this.currentCardIndex.set(Math.max(0, Math.min(this.currentCardIndex(), maxCardIndex)));

    const firstCard = cards[0] as HTMLElement;
    const cardWidth = firstCard?.offsetWidth;
    const cardMargin = parseFloat(window.getComputedStyle(sliderTrack).getPropertyValue('gap'));
    const offset = -(this.currentCardIndex() * (cardWidth + cardMargin));
    sliderTrack.style.transform = `translateX(${offset}px)`;

    // Update button states
    prevBtn.disabled = this.currentCardIndex() === 0;
    nextBtn.disabled = this.currentCardIndex() >= maxCardIndex;
    prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    prevBtn.style.cursor = prevBtn.disabled ? 'default' : 'pointer';
    nextBtn.style.cursor = nextBtn.disabled ? 'default' : 'pointer';
  }

  public openProductDetail() {
    // this.matDialog.open(ProductDetails).afterClosed().subscribe()
    this.matDialog.open(ProductDetailDialog, {
      panelClass: 'product-detail-dialog',
      width: '900px',
      maxWidth: '90vw',
      data: {
        name: 'Silk Saree',
        price: 2500,
        color: 'Ruby Red',
        image: 'assets/images/new-arrival-1.png',
      },
    });
  }

  public next() {
    this.currentCardIndex.set(this.currentCardIndex() + 1);
    this.updateSlider();
  }

  public prev() {
    this.currentCardIndex.set(this.currentCardIndex() - 1);
    this.updateSlider();
  }

  private getDashboardProduct() {
    httpPost<IRGeneric<DashboardResponseRoot>, IDashboadRequest>(
      ApiRoutes.PRODUCT.DASHBOARD,
      this.payload,
      false
    ).subscribe({
      next: (response) => {
        if (response?.data) {
        }
      },
      error: (error) => {
        console.error('Dashboard Product Error: ', error);
      },
    });
  }

  //#region  Hostlistner

  @HostListener('window:resize')
  onWindowResize() {
    if (this.platformService.isBrowser) {
      this.updateSlider();
    }
  }
  //#endregion
}
