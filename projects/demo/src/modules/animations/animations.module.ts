import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {generateRoutes, TuiAddonDocModule} from '@taiga-ui/addon-doc';
import {TuiLetModule} from '@taiga-ui/cdk';
import {TuiButtonModule, TuiLabelModule} from '@taiga-ui/core';
import {TuiSliderModule} from '@taiga-ui/kit';
import {ExampleAnimationsComponent} from './animations.component';
import {TuiHeightCollapseExample} from './examples/height-collapse';
import {TuiWidthCollapseExample} from './examples/width-collapse';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TuiAddonDocModule,
        TuiSliderModule,
        TuiButtonModule,
        TuiLetModule,
        TuiLabelModule,
        RouterModule.forChild(generateRoutes(ExampleAnimationsComponent)),
    ],
    declarations: [
        ExampleAnimationsComponent,
        TuiHeightCollapseExample,
        TuiWidthCollapseExample,
    ],
})
export class ExampleAnimationsModule {}
