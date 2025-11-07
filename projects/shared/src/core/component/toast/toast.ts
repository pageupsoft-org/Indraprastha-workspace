import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EToastType } from '../../enum/toast-type.enum';
import { ToastService } from '../../services/toast-service';

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
