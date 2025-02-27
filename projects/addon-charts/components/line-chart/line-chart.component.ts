import {Location} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    Inject,
    Input,
    NgZone,
    Optional,
} from '@angular/core';
import {draw} from '@taiga-ui/addon-charts/utils';
import {
    inRange,
    TuiContextWithImplicit,
    tuiDefaultProp,
    TuiIdService,
    tuiPure,
    TuiStringHandler,
    tuiZoneOptimized,
} from '@taiga-ui/cdk';
import {TuiPoint} from '@taiga-ui/core';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import {Observable, Subject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {TuiLineChartHintDirective} from './line-chart-hint.directive';

export function smoothingAssertion(smoothingFactor: number): boolean {
    return inRange(smoothingFactor, 0, 100);
}

const SMOOTHING_MESSAGE = 'smoothingFactor must be between 0 and 100';

@Component({
    selector: 'tui-line-chart',
    templateUrl: './line-chart.template.html',
    styleUrls: ['./line-chart.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiLineChartComponent {
    @Input('value')
    @tuiDefaultProp()
    set valueSetter(value: ReadonlyArray<TuiPoint>) {
        this.value = value.filter(item => !item.some(isNaN));
    }

    @Input()
    @tuiDefaultProp()
    x = 0;

    @Input()
    @tuiDefaultProp()
    y = 0;

    @Input()
    @tuiDefaultProp()
    width = 0;

    @Input()
    @tuiDefaultProp()
    height = 0;

    @Input()
    @tuiDefaultProp(smoothingAssertion, SMOOTHING_MESSAGE)
    smoothingFactor = 0;

    @Input()
    @tuiDefaultProp()
    hintContent: PolymorpheusContent<TuiContextWithImplicit<TuiPoint>> = '';

    @Input()
    @tuiDefaultProp()
    xStringify: TuiStringHandler<number> | null = null;

    @Input()
    @tuiDefaultProp()
    yStringify: TuiStringHandler<number> | null = null;

    @Input()
    @tuiDefaultProp()
    filled = false;

    @Input()
    @tuiDefaultProp()
    dots = false;

    value: ReadonlyArray<TuiPoint> = [];

    private readonly _hovered$ = new Subject<number>();

    private readonly autoIdString: string;

    constructor(
        @Inject(TuiIdService) idService: TuiIdService,
        @Inject(NgZone) private readonly ngZone: NgZone,
        @Inject(Location) private readonly locationRef: Location,
        @Optional()
        @Inject(TuiLineChartHintDirective)
        private readonly hintDirective: TuiLineChartHintDirective | null,
    ) {
        this.autoIdString = idService.generate();
    }

    @tuiPure
    get hovered$(): Observable<number> {
        return this._hovered$.pipe(distinctUntilChanged(), tuiZoneOptimized(this.ngZone));
    }

    get fillId(): string {
        return 'tui-line-chart-' + this.autoIdString;
    }

    get fill(): string {
        return this.filled
            ? `url(${this.locationRef.prepareExternalUrl(this.locationRef.path())}#${
                  this.fillId
              })`
            : 'none';
    }

    get viewBox(): string {
        return `${this.x} ${this.y} ${this.width} ${this.height}`;
    }

    get d(): string {
        return this.getD(this.value, this.smoothingFactor);
    }

    get fillD(): string {
        return this.value.length
            ? this.d + `V ${this.y} H ${this.value[0][0]} V ${this.value[0][1]}`
            : this.d;
    }

    get computedHint():
        | PolymorpheusContent<TuiContextWithImplicit<TuiPoint>>
        | PolymorpheusContent<TuiContextWithImplicit<ReadonlyArray<TuiPoint>>> {
        return this.hintDirective ? this.hintDirective.hint : this.hintContent;
    }

    get isFocusable(): boolean {
        return !this.hintDirective && this.hasHints;
    }

    get hasHints(): boolean {
        return !!this.xStringify || !!this.yStringify || !!this.computedHint;
    }

    getX(index: number): number {
        if (this.isSinglePoint) {
            return this.value[0][0] / 2;
        }

        return index
            ? (this.value[index - 1][0] + this.value[index][0]) / 2
            : 2 * this.value[0][0] - this.getX(1);
    }

    getWidth(index: number): number {
        return (100 * this.computeWidth(index)) / this.width;
    }

    getHintId(index: number): string {
        return `${this.autoIdString}_${index}`;
    }

    getContentContext(
        $implicit: TuiPoint,
    ):
        | TuiContextWithImplicit<TuiPoint>
        | TuiContextWithImplicit<ReadonlyArray<TuiPoint>> {
        return this.hintDirective
            ? this.hintDirective.getContext(this.value.indexOf($implicit), this)
            : {$implicit};
    }

    getHovered(hovered: number): TuiPoint | null {
        // This checks for NaN and null too since async pipe returns null before first item
        return Number.isInteger(hovered) ? this.value[hovered] : null;
    }

    getBottom(y: number): number {
        return (100 * (y - this.y)) / this.height;
    }

    getLeft(x: number): number {
        return (100 * (x - this.x)) / this.width;
    }

    getOffset(x: number): number {
        return (100 * (this.value[x][0] - this.getX(x))) / this.computeWidth(x);
    }

    onMouseEnter(index: number) {
        if (this.hintDirective) {
            this.hintDirective.raise(index, this);
        } else {
            this.onHovered(index);
        }
    }

    onHovered(index: number) {
        this._hovered$.next(index);
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        if (!this.hintDirective) {
            this.onHovered(NaN);
        }
    }

    private get isSinglePoint(): boolean {
        return this.value.length === 1;
    }

    @tuiPure
    private getD(value: ReadonlyArray<TuiPoint>, smoothingFactor: number): string {
        return value.reduce(
            (d, point, index) =>
                index ? `${d} ${draw(value, index, smoothingFactor)}` : `M ${point}`,
            '',
        );
    }

    private computeWidth(index: number): number {
        return index === this.value.length - 1
            ? 2 * (this.value[index][0] - this.getX(index))
            : this.getX(index + 1) - this.getX(index);
    }
}
