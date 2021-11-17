import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminLayoutsComponent} from './admin-layouts.component';
import {UsersComponent} from "../../../users/users.component";
import {ComplaintsComponent} from "../../../users/complaints/complaints.component";
import {PhotosComponent} from "../../../photos/photos/photos.component";

const routes: Routes = [{
  path: '', component: AdminLayoutsComponent, children: [
    {
      path: 'users', component: UsersComponent,
    },
    {
      path: 'complaints/:email', component: ComplaintsComponent
    },
    {
      path: 'photos', component: PhotosComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutsRoutingModule {
}
