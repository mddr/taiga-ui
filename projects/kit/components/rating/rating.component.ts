import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import {tuiIconStarFilledLarge, tuiIconStarLarge} from '@taiga-ui/icons';

@Component({
    selector: 'tui-rating',
    templateUrl: './rating.template.html',
    styleUrls: ['./rating.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiRatingComponent {
    @Input() public tuiRateMax: number = 5;
    @Input() public tuiRateReadonly: boolean = false;
    @Input() public tuiRateDisable: boolean = false;
    @Input() public tuiRateColor: string = 'var(--tui-accent)';
    @Input() public tuiRateEmptyIcon: string = tuiIconStarLarge;
    @Input() public tuiRateSelectedIcon: string = tuiIconStarFilledLarge;

    @Output()
    public readonly tuiRateActiveChange: EventEmitter<number> = new EventEmitter();

    @Output()
    public readonly tuiRateFocusChange: EventEmitter<number> = new EventEmitter();

    @Output()
    public readonly tuiRateBlurChange: EventEmitter<number> = new EventEmitter();

    public focusedRate: number = 0;
    public currentRate: number = 0;

    public get tuiRateActive(): number {
        return this.currentRate;
    }

    @Input()
    public set tuiRateActive(rate: number) {
        this.currentRate = rate || 0;
    }

    public tuiRateSetActive(step: number): void {
        if (this.tuiRateReadonly) {
            return;
        }

        this.currentRate = step;
        this.tuiRateActiveChange.emit(step);
    }

    public tuiRateOnFocus(step: number): void {
        if (this.tuiRateReadonly) {
            return;
        }

        this.focusedRate = step;
        this.tuiRateFocusChange.emit(step);
    }

    public tuiRateOnBlur(step: number): void {
        if (this.tuiRateReadonly) {
            return;
        }

        this.focusedRate = 0;
        this.tuiRateBlurChange.emit(step);
    }
}
