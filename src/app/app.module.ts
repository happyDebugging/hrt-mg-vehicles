import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { VehicleLinesComponent } from './vehicle-lines/vehicle-lines.component';
import { DbFunctionService } from './shared/services/db-functions.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptor } from './auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    VehicleDetailsComponent,
    VehicleLinesComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterLink, 
    RouterOutlet,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    DbFunctionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

