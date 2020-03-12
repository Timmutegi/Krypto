import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';


import { DashboardComponent } from './dashboard/dashboard.component';
import { BranchComponent } from './branch/branch.component';
import { LandlordComponent } from './landlord/landlord.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { TenantComponent } from './tenant/tenant.component';
import { RegionComponent } from './region/region.component';
import { AgentComponent } from './agent/agent.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { CaretakerComponent } from './caretaker/caretaker.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'branch', component: BranchComponent, canActivate: [AuthGuard] },
  { path: 'landlord', component: LandlordComponent, canActivate: [AuthGuard] },
  { path: 'apartment', component: ApartmentComponent, canActivate: [AuthGuard] },
  { path: 'tenant', component: TenantComponent, canActivate: [AuthGuard] },
  { path: 'region', component: RegionComponent, canActivate: [AuthGuard] },
  { path: 'agent', component: AgentComponent, canActivate: [AuthGuard] },
  { path: 'user', component: SuperadminComponent, canActivate: [AuthGuard]},
  { path: 'caretaker', component: CaretakerComponent, canActivate: [AuthGuard]},
];




@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
