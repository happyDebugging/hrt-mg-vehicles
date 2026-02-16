import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'hrt-mg-vehicles';

  isUserLoggedIn = false;
  showToggler = false;
  private destroy$ = new Subject<void>();
  private tokenRefreshInterval: any;
  private inactivityTimeout: any;
  
  // Refresh token every 4 minutes (proactive refresh)
  private readonly TOKEN_REFRESH_INTERVAL = 4 * 60 * 1000;
  
  // Check for inactivity every 30 seconds
  private readonly INACTIVITY_CHECK_INTERVAL = 30 * 1000;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url || '/';
    this.updateVisibility(url);

    // Update visibility on route changes
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      const nav = e as NavigationEnd;
      this.updateVisibility(nav.urlAfterRedirects);
    });

    // Check and refresh token on app initialization
    this.checkAndRefreshToken();

    // Set up periodic token refresh (proactive refresh before expiration)
    this.startTokenRefreshTimer();

    // Listen for when user returns to the tab/window
    this.setupWindowFocusListener();

    // Setup user activity detection
    this.setupActivityDetection();

    // Subscribe to token expiration events
    this.authService.tokenExpired$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((isExpired: boolean) => {
      if (isExpired) {
        this.isUserLoggedIn = false;
        this.showToggler = false;
        console.log('Token expired - access disabled');
      }
    });

    // Subscribe to token refresh events
    this.authService.tokenRefreshed$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.authService.isLoggedIn()) {
        this.isUserLoggedIn = true;
        console.log('Token successfully refreshed');
      }
    });
  }

  /**
   * Check if token is expired on app initialization and refresh if needed
   */
  private checkAndRefreshToken(): void {
    if (this.authService.isLoggedIn()) {
      const session = this.authService.getSession();
      if (session?.access_token && this.authService.isTokenExpired(session.access_token)) {
        console.log('Token expired on app initialization, attempting refresh');
        this.authService.refreshToken().subscribe(
          () => {
            console.log('Token refreshed on app initialization');
            this.isUserLoggedIn = true;
            this.showToggler = !this.router.url.includes('/auth');
          },
          (error) => {
            console.error('Failed to refresh token on app initialization:', error);
            this.isUserLoggedIn = false;
            this.showToggler = false;
          }
        );
      } else {
        this.isUserLoggedIn = true;
      }
    }
  }

  /**
   * Start a timer to refresh token proactively before it expires
   */
  private startTokenRefreshTimer(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.tokenRefreshInterval = setInterval(() => {
      if (this.authService.isLoggedIn()) {
        const session = this.authService.getSession();
        if (session?.access_token && this.authService.isTokenExpired(session.access_token)) {
          console.log('Proactive token refresh triggered');
          this.authService.refreshToken().subscribe(
            () => {
              console.log('Token refreshed proactively');
              this.isUserLoggedIn = true;
            },
            (error) => {
              console.error('Failed to refresh token proactively:', error);
              this.isUserLoggedIn = false;
              this.showToggler = false;
            }
          );
        }
      } else {
        // User logged out, stop the refresh timer
        if (this.tokenRefreshInterval) {
          clearInterval(this.tokenRefreshInterval);
        }
      }
    }, this.TOKEN_REFRESH_INTERVAL);
  }

  /**
   * Setup listener for when user returns to the window/tab after being away
   */
  private setupWindowFocusListener(): void {
    window.addEventListener('focus', () => {
      console.log('User returned to window/tab');
      // When user returns to the tab, check if token needs refresh
      if (this.authService.isLoggedIn()) {
        const session = this.authService.getSession();
        if (session?.access_token && this.authService.isTokenExpired(session.access_token)) {
          console.log('Token expired during inactive period, attempting refresh');
          this.authService.refreshToken().subscribe(
            () => {
              console.log('Token refreshed on window focus');
              this.isUserLoggedIn = true;
              this.showToggler = !this.router.url.includes('/auth');
            },
            (error) => {
              console.error('Failed to refresh token on window focus:', error);
              this.isUserLoggedIn = false;
              this.showToggler = false;
            }
          );
        }
      }
    });
  }

  /**
   * Setup activity detection to handle user inactivity
   */
  private setupActivityDetection(): void {
    const resetInactivityTimer = () => {
      // Clear existing timeout
      if (this.inactivityTimeout) {
        clearTimeout(this.inactivityTimeout);
      }

      // Check token periodically (every 30 seconds)
      this.inactivityTimeout = setInterval(() => {
        if (this.authService.isLoggedIn()) {
          const session = this.authService.getSession();
          if (session?.access_token && this.authService.isTokenExpired(session.access_token)) {
            console.log('Token expired due to inactivity, attempting refresh');
            this.authService.refreshToken().subscribe(
              () => {
                console.log('Token refreshed after inactivity check');
              },
              (error) => {
                console.error('Failed to refresh token during inactivity check:', error);
              }
            );
          }
        }
      }, this.INACTIVITY_CHECK_INTERVAL);
    };

    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    activityEvents.forEach(event => {
      document.addEventListener(event, () => {
        resetInactivityTimer();
      }, true);
    });

    // Initialize the timer
    resetInactivityTimer();
  }

  /**
   * Update visibility of header/navigation based on login state and current route
   */
  private updateVisibility(url: string) {
    const loggedIn = this.authService.isLoggedIn();
    this.isUserLoggedIn = loggedIn;
    this.showToggler = loggedIn && !url.includes('/auth');
  }

  /**
   * Logout the user and clean up
   */
  Logout() {
    sessionStorage.clear();
    this.isUserLoggedIn = false;
    this.showToggler = false;
    
    this.authService.logout().subscribe(
      () => {
        console.log('Logged out successfully');
      },
      (error) => {
        console.error('Logout error:', error);
        // Still navigate to login even if API call fails
        this.router.navigate(['/login']);
      }
    );
  }

  /**
   * Clean up on component destruction
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clear all timers
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
    }
    
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
  }
}
