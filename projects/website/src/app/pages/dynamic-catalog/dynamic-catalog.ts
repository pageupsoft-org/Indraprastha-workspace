import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatformService } from '@shared';

@Component({
  selector: 'app-dynamic-catalog',
  imports: [CommonModule, FormsModule],
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
  public currentCols: WritableSignal<number> = signal(3);

  public priceMin: WritableSignal<number> = signal(6999);
  public priceMax: WritableSignal<number> = signal(412499);
  public selectedPrice: WritableSignal<number> = signal(this.priceMin());

  constructor(private platformService: PlatformService) {}

  ngOnInit(): void {
    this.handleResize();
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
}
