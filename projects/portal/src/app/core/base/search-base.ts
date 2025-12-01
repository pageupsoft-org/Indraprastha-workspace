import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Base } from './base';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { LoaderService } from '../services/loader-service';

@Component({
  selector: 'app-search-base',
  standalone: false,
  template: '',
})
export class SearchBase<T> extends Base implements OnInit {
  public data: WritableSignal<T> = signal(null as T);

  public loaderService: LoaderService = inject(LoaderService);
  public searchString$: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.search();
  }

  protected search() {
    this.loaderService.showLoader();
    this.getData()
    .pipe(takeUntil(this.searchString$))
    .subscribe({
      next: (value) => {
        this.data.set(value);
        this.dataLoadedHandler(value);
        this.loaderService.hideLoader();
      },
      error: (err) => {
        this.loaderService.hideLoader();
      }
    });
  }

  protected getData(): Observable<T> {
    return of();
  }

  protected dataLoadedHandler(data: T): void {
    // Override in child class if needed
  }
}
