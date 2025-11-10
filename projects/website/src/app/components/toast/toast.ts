import { Component } from '@angular/core';
import { ToastService } from '../../core/services/toast-service';
import { CommonModule } from '@angular/common';
import { EToastType } from '../../core/enum/toast-type.enum';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  public commonClass: string = "inline-flex items-center justify-center shrink-0 w-8 h-8 z-[9999]";

  public readonly EToastType = EToastType;
  constructor(public toastService: ToastService) {}
}
