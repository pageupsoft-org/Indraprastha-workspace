import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '@portal/core';

@Component({
  selector: 'app-fallback',
  imports: [RouterModule],
  templateUrl: './fallback.html',
  styleUrl: './fallback.scss',
})
export class Fallback {
 public dashBoardRoute = signal<string>(AppRoutes.DASHBOARD);
}
