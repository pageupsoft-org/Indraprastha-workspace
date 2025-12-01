import { Component, EventEmitter, input, Input, OnChanges, OnInit, output, Output, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PaginationControlMetadata } from '../../core/interface/model/pagination-detail.model';

@Component({
  selector: 'app-pagination-controller',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagination-controller.html',
  styleUrl: './pagination-controller.scss',
})
export class PaginationController {

  public paginationControlMetaData = input.required<PaginationControlMetadata>();

  public pageChanged = output<number>();
  public ETopChanged = output<number>();

  public currentPage: WritableSignal<number> = signal(1);
  public top: FormControl<number | null> = new FormControl<number>(10);

  ngOnInit(): void {
    // console.log(this.paginationControlMetaData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);

  }

  public topChanged() {
    this.ETopChanged.emit(this.top.value ?? 10);
    this.currentPage.set(1);
  }
  
  public getClickedPage(pageNumber: number) {
    this.currentPage.set(pageNumber);
    this.pageChanged.emit(pageNumber);
  }
}
