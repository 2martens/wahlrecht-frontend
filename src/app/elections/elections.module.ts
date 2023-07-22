import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingPageComponent} from "./landingpage/landing-page.component";
import {StoreModule} from "@ngrx/store";
import {ElectionsEffects} from "./store/elections.effects";
import {EffectsModule} from "@ngrx/effects";
import {electionsReducers, featureStateName} from "./store";
import {ElectionsRoutingModule} from "./elections-routing.module";
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    ElectionsRoutingModule,
    StoreModule.forFeature(featureStateName, electionsReducers),
    EffectsModule.forFeature([ElectionsEffects]),
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    LandingPageComponent
  ]
})
export class ElectionsModule {
}
