import { Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-generic-save-button',
  imports: [],
  templateUrl: './generic-save-button.html',
  styleUrl: './generic-save-button.css',
})
export class GenericSaveButton {
  public text = input<string>('Save');
  public type = input<'submit' | 'button' | 'reset'>('submit');
  public submit = output<void>();

  public submitted() {
    this.submit.emit();
  }
}
