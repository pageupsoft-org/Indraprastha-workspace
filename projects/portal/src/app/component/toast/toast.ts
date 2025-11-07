import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EToastType, ToastService } from '@Core';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  public readonly EToastType = EToastType;
  constructor(public toastService: ToastService) {}
}
