import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {RegisterComponent} from "./register/register.component";
import {AuthGuard} from "./shared/classes/auth.guard";
import {AdminComponent} from "./admin/admin.component";
import {CabinetComponent} from "./site-pages/cabinet/cabinet.component";

const routes: Routes = [
  {path: '', component: AuthLayoutComponent, children: [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
    ]},
  {path: '', component: SiteLayoutComponent, canActivate: [AuthGuard],  children: [
      {path: 'cabinet', component: CabinetComponent}
    ]},
  {path: 'administrator', component: AdminComponent, canActivate: [AuthGuard],  children: [
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
