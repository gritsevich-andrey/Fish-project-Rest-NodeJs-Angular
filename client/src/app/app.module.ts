import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';
import {RegisterComponent} from './register/register.component';
import {CabinetComponent} from "./site-pages/cabinet/cabinet.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./shared/classes/token.interceptor";
import {AuthGuard} from "./shared/classes/auth.guard";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ComplaintsComponent} from './admin/users/complaints/complaints.component';
import {NgxPaginationModule} from "ngx-pagination";
import {NgxStarRatingModule} from "ngx-star-rating";
import {TravelComponent} from './site-pages/travel/travel.component';
import {MatSortModule} from "@angular/material/sort";
import {MatTabsModule} from "@angular/material/tabs";
import {MatPaginatorModule} from '@angular/material/paginator';
import {NgImageSliderModule} from 'ng-image-slider';
import {QuestionsComponent} from './site-pages/chat/questions/questions.component';
import {RestorePasswordComponent} from './restore-password/restore-password.component';
import {LiveFeedComponent} from './site-pages/live-feed/live-feed.component';
import {ChatComponent} from './site-pages/chat/chat.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {PhotoInterceptor} from "./shared/classes/photo.interceptor";
import {ReadMoreModule} from "ng-readmore";
import {SharedModule} from "./shared/shared.module";
import {SearchPipe} from "./shared/pipes/search.pipe";
import {MapTravelComponent} from './site-pages/map-travel/map-travel.component';
import {AngularYandexMapsModule, YaConfig} from "angular8-yandex-maps";
import {MatRadioModule} from "@angular/material/radio";
import {ListDescriptionsComponent} from "./site-pages/map-travel/list-descriptions/list-descriptions.component";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {DialogComponent} from './site-pages/map-travel/list-descriptions/dialog/dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { ChatDialogComponent } from './site-pages/map-travel/list-descriptions/chat-dialog/chat-dialog.component';
import {CommentComponent} from "./site-pages/cabinet/comment/comment.component";
import {ReviewComponent} from "./site-pages/map-travel/list-descriptions/review/review.component";
import { TravelItemComponent } from './site-pages/travel/travel-item/travel-item.component';
import { JoinedTravelComponent } from './site-pages/travel/travel-item/joined-travel/joined-travel.component';
import { CreatedTravelComponent } from './site-pages/travel/travel-item/created-travel/created-travel.component';

const mapConfig: YaConfig = {
  apikey: '6c5c5f61-fa87-4efd-8ad9-f652f1fd0727',
  lang: 'ru_RU',
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterComponent,
    CabinetComponent,
    ComplaintsComponent,
    TravelComponent,
    QuestionsComponent,
    RestorePasswordComponent,
    LiveFeedComponent,
    ChatComponent,
    SearchPipe,
    MapTravelComponent,
    ListDescriptionsComponent,
    DialogComponent,
    ChatDialogComponent,
    CommentComponent,
    ReviewComponent,
    TravelItemComponent,
    JoinedTravelComponent,
    CreatedTravelComponent,
  ],
  imports: [
    NgImageSliderModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    CommonModule,
    SharedModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    NgxPaginationModule,
    NgxStarRatingModule,
    MatSortModule,
    MatTabsModule,
    MatPaginatorModule,
    InfiniteScrollModule,
    ReadMoreModule,
    AngularYandexMapsModule.forRoot(mapConfig),
    MatRadioModule,
    MatCardModule,
    MatListModule,
    MatSelectModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: TokenInterceptor
  },
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PhotoInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
