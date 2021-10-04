import {ContentChild, Directive, HostBinding, HostListener, Inject} from '@angular/core';
import {WINDOW} from '@ng-web-apis/common';
import {TUI_SHEET_SCROLL} from '@taiga-ui/addon-mobile/components';
import {TUI_IS_IOS, tuiPure} from '@taiga-ui/cdk';
import {asCallable} from '@tinkoff/ng-event-plugins';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {TuiSheetComponent} from '../sheet.component';

// Per design top margin
const OFFSET = 16;

// @dynamic
@Directive({
    selector: '[tuiSheetWrapper]',
    host: {
        '[class._ios]': 'isIos',
    },
})
export class TuiSheetWrapperDirective {
    @ContentChild(TuiSheetComponent)
    private readonly sheet?: TuiSheetComponent<unknown>;

    @ContentChild(TuiSheetComponent, {read: TUI_SHEET_SCROLL})
    private readonly scroll$!: Observable<number>;

    constructor(
        @Inject(TUI_IS_IOS) readonly isIos: boolean,
        @Inject(WINDOW) private readonly windowRef: Window,
    ) {}

    @tuiPure
    @HostBinding('$.class._overlay')
    @HostListener('$.class._overlay')
    get overlay$(): Function {
        return asCallable(
            this.scroll$.pipe(
                filter(() => !this.sheet?.item.overlay),
                map(scrollTop => this.isOverlayVisible(scrollTop)),
            ),
        );
    }

    /**
     * Safari does not allow to toggle pointer-events on the fly to
     * determine what container is going to scroll on subsequent
     * touchmove, so we have to hack our way through it
     */
    @tuiPure
    @HostBinding('$.style.height.px')
    @HostListener('$.style.height.px')
    get height$(): Function {
        return asCallable(
            this.scroll$.pipe(
                filter(() => this.isIos && this.clickthrough),
                map(value => Math.min(this.withImage(value) + OFFSET, this.maxHeight)),
            ),
        );
    }

    @HostBinding('class._clickthrough')
    get clickthrough(): boolean {
        return !!this.sheet?.clickthrough;
    }

    private get maxHeight(): number {
        return this.windowRef.innerHeight - OFFSET;
    }

    private isOverlayVisible(scrollTop: number): boolean {
        return scrollTop + OFFSET > this.maxHeight;
    }

    private withImage(value: number): number {
        return !this.sheet?.imageStop || value > this.sheet.imageStop
            ? value
            : value - this.sheet.imageHeight;
    }
}
