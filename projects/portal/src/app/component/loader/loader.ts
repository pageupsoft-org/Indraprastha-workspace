import { Component, signal, WritableSignal } from '@angular/core';
import { LoaderService } from '@Core';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  public showLoader: WritableSignal<boolean> = signal(false);

  constructor(private _loader: LoaderService) {
    this._loader.isLoader$.subscribe((res: boolean) => {
      this.showLoader.set(res);
    });
  }
}
