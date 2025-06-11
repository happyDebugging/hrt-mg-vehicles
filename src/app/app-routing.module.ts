import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { VehicleLinesComponent } from './vehicle-lines/vehicle-lines.component';

const routes: Routes = [

  //{ path: 'auth', component: AuthComponent, pathMatch: 'full', canActivate: [LoggedInGuard]}, 
  //{ path: 'reset-password/session/:session-id', pathMatch: 'full', component: ResetPasswordComponent},

  { path: '', pathMatch: 'full', component: VehicleLinesComponent }, //, canActivate: [AuthGuard] // redirect to `app-component`  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
  { path: '**', pathMatch: 'full', redirectTo: ''},  //, canActivate: [AuthGuard] // Wildcard route for a 404 page

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
