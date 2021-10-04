import {Component, Input} from '@angular/core';
import {tuiHeightCollapse} from '@taiga-ui/core';
import {BehaviorSubject} from 'rxjs';
import {changeDetection} from '../../../../change-detection-strategy';
import {encapsulation} from '../../../../view-encapsulation';

@Component({
    selector: 'tui-height-collapse-example',
    templateUrl: './index.html',
    styleUrls: ['./index.less'],
    changeDetection,
    encapsulation,
    animations: [tuiHeightCollapse],
})
export class TuiHeightCollapseExample {
    @Input()
    speed = 0;

    readonly isShown$ = new BehaviorSubject(false);

    get animation() {
        return {
            value: '',
            params: {duration: this.speed},
        } as const;
    }
}
