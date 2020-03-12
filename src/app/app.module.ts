import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { BranchComponent } from './branch/branch.component';
import { LandlordComponent } from './landlord/landlord.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { TenantComponent } from './tenant/tenant.component';
import { RegionComponent } from './region/region.component';
import { AgentComponent } from './agent/agent.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { CaretakerComponent } from './caretaker/caretaker.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    DashboardComponent,
    AdminComponent,
    BranchComponent,
    LandlordComponent,
    ApartmentComponent,
    TenantComponent,
    RegionComponent,
    AgentComponent,
    SuperadminComponent,
    CaretakerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTablesModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
