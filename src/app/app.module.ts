import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { VehicleLinesComponent } from './vehicle-lines/vehicle-lines.component';
import { DbFunctionService } from './shared/services/db-functions.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    VehicleDetailsComponent,
    VehicleLinesComponent
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
    DbFunctionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
