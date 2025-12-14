import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { NewArrivalProductCard } from '../../../components/new-arrival-product-card/new-arrival-product-card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDetailDialog } from '../../../components/product-detail-dialog/product-detail-dialog';
import { PlatformService } from '@shared';
import { Product } from './dashboard.response';
import { IProductDetailDT } from '../../../components/product-detail-dialog/product-detail-dialog.model';

@Component({
  selector: 'app-product-slider',
  imports: [NewArrivalProductCard, MatDialogModule],
  templateUrl: './product-slider.html',
  styleUrl: './product-slider.scss',
})
export class ProductSlider implements AfterViewInit {
  public title = input.required<string>();
  public productList = input.required<Product[]>();

  sliderTrack = viewChild<ElementRef<HTMLDivElement>>('sliderTrack');
  prevBtn = viewChild<ElementRef<HTMLButtonElement>>('prevBtn');
  nextBtn = viewChild<ElementRef<HTMLButtonElement>>('nextBtn');
  cardsContainer = viewChild<ElementRef<HTMLDivElement>>('cardsContainer');

  // public productList: WritableSignal<Product[]> = signal([]);

  public totalCards = computed(() => this.productList().length);
  public currentCardIndex: WritableSignal<number> = signal(0);

  constructor(private platformService: PlatformService, private matDialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.platformService.isBrowser) {
      // const cards = Array.from(this.sliderTrack()?.nativeElement.children) as HTMLElement[];
      const track = this.sliderTrack()?.nativeElement;
      if (!track) return;
      const cards = Array.from(track.children) as HTMLElement[];

      // this.totalCards.set(cards.length);
      this.updateSlider();
    }
  }

  private updateSlider() {
    const track = this.sliderTrack()?.nativeElement as HTMLElement | null;
    const prevBtn = this.prevBtn()?.nativeElement as HTMLButtonElement | null;
    const nextBtn = this.nextBtn()?.nativeElement as HTMLButtonElement | null;

    if (!track || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.children) as HTMLElement[];

    // Visible cards based on screen width
    const visibleCards = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1;

    const maxIndex = this.totalCards() - visibleCards;

    // Clamp the current index using signals
    const clampedIndex = Math.max(0, Math.min(this.currentCardIndex(), maxIndex));
    this.currentCardIndex.set(clampedIndex);

    // Card width + gap
    const firstCard = cards[0];
    const cardWidth = firstCard?.offsetWidth ?? 0;

    const gap = parseFloat(window.getComputedStyle(track).getPropertyValue('gap'));

    const offset = -(clampedIndex * (cardWidth + gap));
    track.style.transform = `translateX(${offset}px)`;

    // Button states
    const isAtStart = clampedIndex === 0;
    const isAtEnd = clampedIndex >= maxIndex;

    prevBtn.disabled = isAtStart;
    nextBtn.disabled = isAtEnd;

    prevBtn.style.opacity = isAtStart ? '0.5' : '1';
    nextBtn.style.opacity = isAtEnd ? '0.5' : '1';

    prevBtn.style.cursor = isAtStart ? 'default' : 'pointer';
    nextBtn.style.cursor = isAtEnd ? 'default' : 'pointer';
  }

  public openProductDetail(productId: number) {
    const data: IProductDetailDT = {
      productId: productId,
      type: 'detail',
    };
    this.matDialog.open(ProductDetailDialog, {
      panelClass: 'product-detail-dialog',
      width: '900px',
      maxWidth: '90vw',
      height: '1000px',
      maxHeight: '90vh',
      data: data,
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

  //#region  Hostlistner

  @HostListener('window:resize')
  onWindowResize() {
    if (this.platformService.isBrowser) {
      this.updateSlider();
    }
  }
  //#endregion
}
