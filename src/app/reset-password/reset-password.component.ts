import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  // Form fields
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // State
  isInviteFlow = false;
  inviteToken = '';
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'danger' | '' = '';

  constructor(
    private dbFunctionService: DbFunctionService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Check for session-id route parameter (from invite link redirect)
    const sessionId = this.route.snapshot.paramMap.get('session-id');

    // Check if arriving from a Supabase invite/recovery redirect (hash fragment)
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // remove leading #
      const accessToken = params.get('access_token');
      const type = params.get('type');

      if (accessToken && (type === 'invite' || type === 'recovery' || type === 'magiclink')) {
        this.isInviteFlow = true;
        this.inviteToken = accessToken;

        // Clean the hash from the URL without reloading
        history.replaceState(null, '', window.location.pathname);
        return;
      }
    }

    // If we have a session-id but no hash token, the invite link was already consumed or invalid
    if (sessionId) {
      this.isInviteFlow = true;
      // The access_token should have been in the hash — if missing, show error
      if (!this.inviteToken) {
        this.message = 'Ο σύνδεσμος έχει λήξει ή έχει ήδη χρησιμοποιηθεί. Παρακαλώ επικοινωνήστε με τον διαχειριστή.';
        this.messageType = 'danger';
      }
      return;
    }

    // If not invite flow, user must be logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  get passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }

  get passwordLongEnough(): boolean {
    return this.newPassword.length >= 6;
  }

  get canSubmit(): boolean {
    if (this.isSubmitting) return false;
    if (!this.newPassword || !this.confirmPassword) return false;
    if (!this.passwordsMatch) return false;
    if (!this.passwordLongEnough) return false;
    if (!this.isInviteFlow && !this.currentPassword) return false;
    return true;
  }

  async onSubmit() {
    if (!this.canSubmit) return;

    this.isSubmitting = true;
    this.message = '';
    this.messageType = '';

    try {
      if (this.isInviteFlow) {
        // Invite flow: use the invite token, no current password
        await this.dbFunctionService.changePassword(this.newPassword, undefined, this.inviteToken);
        this.message = 'Ο κωδικός ορίστηκε επιτυχώς! Ανακατεύθυνση στη σύνδεση...';
        this.messageType = 'success';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } else {
        // Logged-in user flow: verify current password
        await this.dbFunctionService.changePassword(this.newPassword, this.currentPassword);
        this.message = 'Ο κωδικός ενημερώθηκε επιτυχώς!';
        this.messageType = 'success';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      }
    } catch (error: any) {
      this.message = error.message || 'Σφάλμα κατά την αλλαγή κωδικού';
      this.messageType = 'danger';
    } finally {
      this.isSubmitting = false;
    }
  }
}
