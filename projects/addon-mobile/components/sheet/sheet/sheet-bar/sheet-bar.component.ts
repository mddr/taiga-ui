import {Component, Inject, NgZone} from '@angular/core';
import {TuiSheetComponent} from '@taiga-ui/addon-mobile/components';
import {clamp} from '@taiga-ui/cdk';
import {tuiZonefulMap} from '@taiga-ui/core';
import {Observable} from 'rxjs';
import {TUI_SHEET_SCROLL} from '../sheet.providers';

@Component({
    selector: 'tui-sheet-bar',
    templateUrl: 'sheet-bar.template.html',
    styleUrls: ['sheet-bar.style.less'],
})
export class TuiSheetBarComponent {
    readonly rotate$ = this.scroll$.pipe(
        tuiZonefulMap(y => clamp(10 - (y - this.stop) / 5, 0, 10), this.ngZone),
    );

    constructor(
        @Inject(TuiSheetComponent) private readonly sheet: TuiSheetComponent<unknown>,
        @Inject(TUI_SHEET_SCROLL) private readonly scroll$: Observable<number>,
        @Inject(NgZone) private readonly ngZone: NgZone,
    ) {}

    private get stop() {
        return this.sheet.stops[0] ?? 0;
    }
}
