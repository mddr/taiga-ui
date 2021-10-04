import {default as heightCollapseExampleHtml} from '!!raw-loader!./examples/height-collapse/index.html';
import {default as heightCollapseExampleLess} from '!!raw-loader!./examples/height-collapse/index.less';
import {default as heightCollapseExampleTs} from '!!raw-loader!./examples/height-collapse/index.ts';

import {default as widthCollapseExampleHtml} from '!!raw-loader!./examples/width-collapse/index.html';
import {default as widthCollapseExampleLess} from '!!raw-loader!./examples/width-collapse/index.less';
import {default as widthCollapseExampleTs} from '!!raw-loader!./examples/width-collapse/index.ts';

import {Component} from '@angular/core';
import {changeDetection} from '../../change-detection-strategy';
import {FrontEndExample} from '../interfaces/front-end-example';

@Component({
    selector: 'example-animations',
    templateUrl: './animations.template.html',
    changeDetection,
})
export class ExampleAnimationsComponent {
    speed = 1000;

    readonly heightCollapseExample: FrontEndExample = {
        TypeScript: heightCollapseExampleTs,
        HTML: heightCollapseExampleHtml,
        LESS: heightCollapseExampleLess,
    };

    readonly widthCollapseExample: FrontEndExample = {
        TypeScript: widthCollapseExampleTs,
        HTML: widthCollapseExampleHtml,
        LESS: widthCollapseExampleLess,
    };
}
