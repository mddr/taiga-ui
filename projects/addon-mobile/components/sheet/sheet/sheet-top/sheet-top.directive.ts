import {Directive, ElementRef, Inject, Input, NgZone} from '@angular/core';
import {clamp, tuiDefaultProp} from '@taiga-ui/cdk';
import {tuiZonefulMap} from '@taiga-ui/core';
import {Observable} from 'rxjs';
import {TUI_SHEET_SCROLL} from '../sheet.providers';

// So that borders get rounded when image is visible for at least 10px
const OFFSET = 10;

@Directive({
    selector: '[tuiSheetTop]',
    host: {
        '[$.style.transform]': 'transform$',
        '($.style.transform)': 'transform$',
        '[$.class._rounded]': 'rounded$',
        '($.class._rounded)': 'rounded$',
        '[$.class._clickthrough]': 'clickthrough$',
        '($.class._clickthrough)': 'clickthrough$',
    },
})
export class TuiSheetTopDirective {
    @Input('tuiSheetTop')
    @tuiDefaultProp()
    stop = 0;

    readonly transform$ = this.scroll$.pipe(
        tuiZonefulMap(y => `translate3d(0, ${this.getTransform(y)}%, 0)`, this.ngZone),
    );

    readonly clickthrough$ = this.scroll$.pipe(
        tuiZonefulMap(y => !!Math.round(this.getTransform(y)), this.ngZone),
    );

    readonly rounded$ = this.scroll$.pipe(
        tuiZonefulMap(y => y < this.stop + OFFSET, this.ngZone),
    );

    constructor(
        @Inject(TUI_SHEET_SCROLL) private readonly scroll$: Observable<number>,
        @Inject(ElementRef) private readonly elementRef: ElementRef<HTMLElement>,
        @Inject(NgZone) private readonly ngZone: NgZone,
    ) {}

    private getTransform(scrollTop: number): number {
        const value = scrollTop - this.stop;
        const total = this.elementRef.nativeElement.offsetTop - this.stop;

        return this.stop && clamp(100 - (value / total) * 100, 0, 100);
    }
}
