import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs';
import { setHttpClient, Toast } from '@shared';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  public currentRoute: string = '';
  protected readonly title = signal('Indraprastha-portal');
  constructor(private httpClient: HttpClient, private router: Router) {
    setHttpClient(httpClient);
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
        console.log('✅ Current route:', this.currentRoute);
      });
  }
}
