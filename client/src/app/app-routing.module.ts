import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {RegisterComponent} from "./register/register.component";
import {AuthGuard} from "./shared/classes/auth.guard";
import {CabinetComponent} from "./site-pages/cabinet/cabinet.component";
import {TravelComponent} from "./site-pages/travel/travel.component";
import {QuestionsComponent} from "./site-pages/chat/questions/questions.component";
import {RestorePasswordComponent} from "./restore-password/restore-password.component";

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'restore-password', component: RestorePasswordComponent}
    ]
  },
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      {path: 'cabinet', component: CabinetComponent, canActivate: [AuthGuard]},
      {path: 'travel', component: TravelComponent, canActivate: [AuthGuard]},
      {path: 'chat', component: QuestionsComponent, canActivate: [AuthGuard]}
    ]
  },
  { path: 'administrator', loadChildren: () => import('./admin/shared/layouts/admin-layouts/admin-layouts.module').then(m => m.AdminLayoutsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
