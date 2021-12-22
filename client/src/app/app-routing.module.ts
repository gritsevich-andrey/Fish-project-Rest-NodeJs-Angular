import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {RegisterComponent} from "./register/register.component";
import {AuthGuard} from "./shared/classes/auth.guard";
import {CabinetComponent} from "./site-pages/cabinet/cabinet.component";
import {TravelComponent} from "./site-pages/travel/travel.component";
import {RestorePasswordComponent} from "./restore-password/restore-password.component";
import {LiveFeedComponent} from "./site-pages/live-feed/live-feed.component";
import {ChatComponent} from "./site-pages/chat/chat.component";
import {MapTravelComponent} from "./site-pages/map-travel/map-travel.component";
import {JoinComponent} from "./site-pages/join/join.component";

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
      {path: 'map-travel', component: MapTravelComponent, canActivate: [AuthGuard]},
      {path: 'travel/:cryptData', component: TravelComponent, canActivate: [AuthGuard]},
      {path: 'travel', component: TravelComponent, canActivate: [AuthGuard]},
      {path: 'chat', component: ChatComponent, canActivate: [AuthGuard]},
      {path: 'feed', component: LiveFeedComponent, canActivate: [AuthGuard]},
      {path: 'join/:email', component: JoinComponent, canActivate: [AuthGuard]}
    ]
  },
  { path: 'administrator',
    loadChildren: () =>
      import('./admin/shared/layouts/admin-layouts/admin-layouts.module').then(
        ({ AdminLayoutsModule }) => AdminLayoutsModule
      ),
    // loadChildren: () => import('./admin/shared/layouts/admin-layouts/admin-layouts.module').then(m => m.AdminLayoutsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
