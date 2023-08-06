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
import { ElectionComponent } from './election/election.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ElectionContainerComponent } from './election-container/election-container.component';
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [
    LandingPageComponent,
    ElectionComponent,
    ElectionContainerComponent
  ],
    imports: [
        CommonModule,
        ElectionsRoutingModule,
        StoreModule.forFeature(featureStateName, electionsReducers),
        EffectsModule.forFeature([ElectionsEffects]),
        MatTableModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatTabsModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
  exports: [
    LandingPageComponent
  ]
})
export class ElectionsModule {
}
