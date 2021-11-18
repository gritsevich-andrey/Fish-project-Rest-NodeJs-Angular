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
import {AngularLibYandexMapsModule} from "angular-lib-yandex-maps";
import {MatRadioModule} from "@angular/material/radio";

const mapConfig: YaConfig = {
  apikey: 'null',
  lang: 'en_US',
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
    MapTravelComponent
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
    NgxPaginationModule,
    NgxStarRatingModule,
    MatSortModule,
    MatTabsModule,
    MatPaginatorModule,
    InfiniteScrollModule,
    ReadMoreModule,
    AngularYandexMapsModule.forRoot(mapConfig),
    MatRadioModule,
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
