import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { SearchBase } from '../../core/base/search-base';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  public placeholderText = input('Search items');
  public emitText = output<string>();
  public inputText: FormControl<string | null> = new FormControl<string | null>(null);

  constructor() {
    this.inputText.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.emitText.emit(value || '');
    });
  }
}
