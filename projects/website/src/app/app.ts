import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { HttpClient } from '@angular/common/http';
import { setHttpClient } from './core/utils/api.helper';
import { Toast } from './components/toast/toast';
import { FirebaseService } from './core/services/firebase-service';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Indraprastha-website');

  constructor(private httpClient: HttpClient, private firebaseService: FirebaseService) {
    setHttpClient(httpClient);

    /* remove comment to use FCM, but first update keys in env file
    //  this.firebaseService.requestPermission();
    // this.firebaseService.listen();
    */
  }
}
