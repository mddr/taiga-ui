import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {generateRoutes, TuiAddonDocModule} from '@taiga-ui/addon-doc';
import {TuiSvgModule} from '@taiga-ui/core';
import {TuiRatingModule, TuiRadioListModule} from '@taiga-ui/kit';
import {ExampleTuiRatingComponent} from './rating.component';
import {TuiRatingExample1} from './examples/1';
import {TuiRatingExample2} from './examples/2';

@NgModule({
    imports: [
        TuiRatingModule,
        CommonModule,
        TuiAddonDocModule,
        TuiRadioListModule,
        TuiSvgModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(generateRoutes(ExampleTuiRatingComponent)),
    ],
    declarations: [ExampleTuiRatingComponent, TuiRatingExample1, TuiRatingExample2],
    exports: [ExampleTuiRatingComponent],
})
export class ExampleTuiRatingModule {}
