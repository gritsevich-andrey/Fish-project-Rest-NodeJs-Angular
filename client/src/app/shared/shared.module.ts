import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "./layouts/site-layout/header/header.component";
import {TopMenuComponent} from "./layouts/site-layout/top-menu/top-menu.component";
import {FooterComponent} from "./layouts/site-layout/footer/footer.component";
import {RouterModule} from "@angular/router";
import {DuplicatePipe} from './pipes/duplicate.pipe';
import {SearchFilterPipe} from "../pipe/search-filter.pipe";
import {EmitterService} from "./services/emitter.service";
import {MatIconModule} from "@angular/material/icon";
import { DuplicateRatingPipe } from './pipes/duplicate-rating.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    TopMenuComponent,
    FooterComponent,
    DuplicatePipe,
    SearchFilterPipe,
    DuplicateRatingPipe
  ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatIconModule
    ],
    exports: [
        HeaderComponent,
        TopMenuComponent,
        FooterComponent,
        FormsModule,
        DuplicatePipe,
        SearchFilterPipe,
        DuplicateRatingPipe
    ],
  providers: [{provide: EmitterService, useClass: EmitterService}]
})
export class SharedModule {
}
