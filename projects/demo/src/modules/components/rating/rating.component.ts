import {ChangeDetectorRef, Component} from '@angular/core';
import {changeDetection} from '../../../change-detection-strategy';
import {FrontEndExample} from '../../interfaces/front-end-example';

import example1Html from '!!raw-loader!./examples/1/index.html';
import example1Ts from '!!raw-loader!./examples/1/index.ts';

import example2Html from '!!raw-loader!./examples/2/index.html';
import example2Ts from '!!raw-loader!./examples/2/index.ts';

import exampleImportModule from '!!raw-loader!./examples/import/import-module.txt';
import exampleInsertTemplate from '!!raw-loader!./examples/import/insert-template.txt';

@Component({
    selector: 'example-rating',
    templateUrl: './rating.template.html',
    changeDetection,
})
export class ExampleTuiRatingComponent {
    readonly exampleImportModule = exampleImportModule;
    readonly exampleInsertTemplate = exampleInsertTemplate;

    readonly example1: FrontEndExample = {
        TypeScript: example1Ts,
        HTML: example1Html,
    };

    readonly example2: FrontEndExample = {
        TypeScript: example2Ts,
        HTML: example2Html,
    };

    public tuiRateActive: number = 0;
    public tuiRateReadonly: boolean = false;
    public tuiRateDisable: boolean = false;

    constructor(private readonly cd: ChangeDetectorRef) {}

    public update(): void {
        this.cd.detectChanges();
    }
}
