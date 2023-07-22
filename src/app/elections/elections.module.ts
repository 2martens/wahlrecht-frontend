import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ElectionsComponent} from "./elections.component";
import {StoreModule} from "@ngrx/store";
import {ElectionsEffects} from "./store/elections.effects";
import {EffectsModule} from "@ngrx/effects";
import {electionsReducers, featureStateName} from "./store";
import {ElectionsRoutingModule} from "./elections-routing.module";
import {MatTableModule} from "@angular/material/table";


@NgModule({
  declarations: [
    ElectionsComponent
  ],
  imports: [
    CommonModule,
    ElectionsRoutingModule,
    StoreModule.forFeature(featureStateName, electionsReducers),
    EffectsModule.forFeature([ElectionsEffects]),
    MatTableModule,
  ],
  exports: [
    ElectionsComponent
  ]
})
export class ElectionsModule {
}
