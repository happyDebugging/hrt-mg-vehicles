// import { Component, OnInit } from '@angular/core';
// //import { initializeApp } from 'firebase/app';
// //import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
// //import { AuthService } from './auth.service';
// import { createClient, SupabaseClient } from '@supabase/supabase-js';
// import { environment } from '../../environments/environment';
// import { AuthService } from './auth.service';

// @Component({
//   selector: 'app-auth',
//   templateUrl: './auth.component.html',
//   styleUrl: './auth.component.css'
// })
// export class AuthComponent implements OnInit {

//   userEmail = '';
//   userPassword = '';
//   accessToken = '';
//   isCredentialsWrong = false;
//   loggedInUserId = '';
//   isUserLoggedIn = false;
//   newUserPassword = '';
//   newUserPasswordConfirmation = '';
//   isPassword6Characters = true;
//   isChangePasswordSuccessfull = false;
//   errorMessageToShow = '';
//   isPasswordVisible = false;

//   hasForgottenPassword = false;
//   emailSent = false;


//   // Initialize Supabase
//   //private supabase: SupabaseClient

//   constructor(private authService: AuthService) { 
//     //this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
//   }

//   ngOnInit() {
//     this.hasForgottenPassword = false;
//     sessionStorage.clear();

//     sessionStorage.setItem('isUserLoggedIn', this.isUserLoggedIn.toString());

//     this.isUserLoggedIn = JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn")));
//     this.loggedInUserId = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserId")));

//     console.log(this.loggedInUserId)

//   }

//   ToggleShowHidePassword() {
//     this.isPasswordVisible = !this.isPasswordVisible;
//   }

//   EnterMailForPasswordReset() {
//     this.hasForgottenPassword = true;
//     this.emailSent = false;
//   }

//   ReturnToSignIn() {
//     this.hasForgottenPassword = false;
//   }

//   // async ResetPassword() {

//   //   await this.supabase.auth.resetPasswordForEmail(this.userEmail, {
//   //     //redirectTo: 'http://localhost:4200'+'/reset-password/session/'+(Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000)
//   //     redirectTo: environment.appUrl + '/reset-password/session/' + (Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000)
//   //     //https://hrt-mg-warehouse.netlify.app
//   //   })
//   //     //sendPasswordResetEmail(this.auth, this.userEmail)
//   //     .then(() => {

//   //       this.emailSent = true;

//   //     })
//   //     .catch((error) => {
//   //       const errorCode = error.code;
//   //       const errorMessage = error.message;

//   //       console.log(errorMessage)

//   //     });
//   // }

//   Login() {
//     sessionStorage.setItem('userEmail', this.userEmail);
//     sessionStorage.setItem('userPassword', this.userPassword);

//     this.errorMessageToShow = '';
//     // this.authService.AuthenticateUser().then(res => {
//     //   this.errorMessageToShow = JSON.parse(JSON.stringify(sessionStorage.getItem("signinErrorMessage")));
//     //   if (this.errorMessageToShow != '') {
//     //     console.log('111111111111111111111')
//     //     this.isCredentialsWrong = true;
//     //   } else {
//     //     console.log('22222222222222')
//     //     this.isCredentialsWrong = false;
//     //   }
//     // });

//     this.authService.login(this.userEmail, this.userPassword).subscribe({
//       next: (res: any) => {
//         this.authService.saveSession(res.session)
//         console.log('Logged in:', res.user)
//       },
//       error: (err: any) => {
//         console.error('Login failed', err.error)
//       },
//     })

//   }

// }


import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  userEmail = '';
  userPassword = '';
  errorMessage = '';
  isPasswordVisible = false;
  hasForgottenPassword = false;
  emailSent = false;

  accessToken = '';
  isCredentialsWrong = false;
  loggedInUserId = '';
  isUserLoggedIn = false;
  newUserPassword = '';
  newUserPasswordConfirmation = '';
  isPassword6Characters = true;
  isChangePasswordSuccessfull = false;
  errorMessageToShow = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
     if (typeof window !== 'undefined' && this.authService.isLoggedIn()) {
    this.router.navigate(['/vehicle-lines'], { replaceUrl: true }); // Redirect if already logged in
  }
  }

  ToggleShowHidePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  Login() {
    this.errorMessageToShow = '';
    this.authService.login(this.userEmail, this.userPassword).subscribe({
      next: (res: any) => {
        this.authService.saveSession(res.session);
        this.router.navigate(['/vehicle-lines'], { replaceUrl: true }); // Navigate after login and replace history
      },
      error: (err: any) => {
        console.error('Login failed', err.error);
        this.errorMessageToShow = 'Invalid email or password';
      },
    });
  }

  // Logout() {
  //   this.authService.logout();
  //   this.router.navigate(['/login']);
  // }
}
