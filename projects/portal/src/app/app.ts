import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlatformService, setHttpClient, Toast } from '@shared';
import { environment } from '@portal/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  public currentRoute: string = '';
  protected readonly title = signal('Indraprastha-portal');
  constructor(
    private httpClient: HttpClient,
    private platformService: PlatformService
  ) {
    setHttpClient(httpClient, environment.baseUrl);
  }
}
