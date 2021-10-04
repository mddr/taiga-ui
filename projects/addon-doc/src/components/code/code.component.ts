import {ChangeDetectorRef, Component, HostBinding, Input} from '@angular/core';
import {TuiDocCodeProcessedValue, TuiDocCodeValue} from '../../interfaces/page';

@Component({
    selector: 'tui-doc-code',
    templateUrl: './code.template.html',
    styleUrls: ['./code.style.less'],
})
export class TuiDocCodeComponent {
    public processedCode: TuiDocCodeProcessedValue = '';

    @Input()
    filename = '';

    constructor(private readonly cd: ChangeDetectorRef) {}

    @Input()
    set code(code: TuiDocCodeValue) {
        this.prepareCode(code).then(() => this.cd.detectChanges());
    }

    @HostBinding('class._has-filename')
    get hasFilename(): boolean {
        return !!this.filename;
    }

    private async prepareCode(code: TuiDocCodeValue): Promise<void> {
        if (code instanceof Promise) {
            this.processedCode = (await (code as Promise<{default: string}>)).default;
        } else {
            this.processedCode = code;
        }
    }
}
