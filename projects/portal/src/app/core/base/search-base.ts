import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Base } from './base';
import { debounceTime, Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'app-search-base',
  standalone: false,
  template: '',
})
export class SearchBase<T> extends Base implements OnInit {
  public data: WritableSignal<T> = signal(null as T);
  ngOnInit(): void {
    this.search();
  }

  protected search() {
    this.getData().subscribe({
      next: (value) => {
        this.data.set(value);
        this.dataLoadedHandler(value);
      },
      error: (err) => {},
    });
  }

  protected getData(): Observable<T> {
    return of();
  }

  protected dataLoadedHandler(data: T): void {
    // Override in child class if needed
  }
}
