import { Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-generic-cancel-button',
  imports: [],
  templateUrl: './generic-cancel-button.html',
  styleUrl: './generic-cancel-button.css',
})
export class GenericCancelButton {
  public text = input<string>('Cancel');
  public type = input<'submit' | 'button' | 'reset'>('submit');
  public cancel = output<void>();

  public cancelled() {
    this.cancel.emit();
  }
}
