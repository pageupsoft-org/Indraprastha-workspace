import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'lib-app-loading-button',
  imports: [CommonModule],
  templateUrl: './app-loading-button.html',
  styleUrl: './app-loading-button.css',
})
export class AppLoadingButton {
  public isLoading = input.required<boolean>();
  public label = input.required<string>();
  public isButtonDisabled = input<boolean>(false);
  public type = input<'button' | 'submit'>('submit');

  // public btnClass = input<string>("bg-red-800 rounded-[5px] text-white font-semibold py-3 px-6 hover:bg-red-900 transition-colors duration-300 uppercase cursor-pointer");
  public btnClass = input<string>(
    'bg-[#680C01] text-white px-6 py-2 md:text-md lg:text-lg cursor-pointer rounded-[12px]'
  );

  public conditionalClass = input<string>();
  public addConditionClass = input<boolean>();

  public clicked = output<void>();

  onClick() {
    if (!this.isLoading()) {
      this.clicked.emit();
    }
  }
}
