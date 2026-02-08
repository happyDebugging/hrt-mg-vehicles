import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'hrt-mg-vehicles';

  isUserLoggedIn = false;
  showToggler = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url || '/';
    this.updateVisibility(url);

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      const nav = e as NavigationEnd;
      this.updateVisibility(nav.urlAfterRedirects);
    });
  }

  private updateVisibility(url: string) {
    const loggedIn = this.authService.isLoggedIn();
    this.isUserLoggedIn = loggedIn;
    this.showToggler = loggedIn && !url.includes('/auth');
  }

  Logout() {
    sessionStorage.clear();
    this.isUserLoggedIn = false;
    this.showToggler = false;
    this.authService.logout();
  }
}
