import {Component, Input} from '@angular/core';
import {tuiWidthCollapse} from '@taiga-ui/core';
import {BehaviorSubject} from 'rxjs';
import {changeDetection} from '../../../../change-detection-strategy';
import {encapsulation} from '../../../../view-encapsulation';

@Component({
    selector: 'tui-width-collapse-example',
    templateUrl: './index.html',
    styleUrls: ['./index.less'],
    changeDetection,
    encapsulation,
    animations: [tuiWidthCollapse],
})
export class TuiWidthCollapseExample {
    @Input()
    speed = 0;

    readonly isShown$ = new BehaviorSubject(true);

    get animation() {
        return {
            value: '',
            params: {duration: this.speed},
        } as const;
    }
}
