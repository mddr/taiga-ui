import {Clipboard} from '@angular/cdk/clipboard';
import {
    Attribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    Optional,
} from '@angular/core';
import {LOCATION} from '@ng-web-apis/common';
import {TuiHandler, tuiPure} from '@taiga-ui/cdk';
import {TuiNotification, TuiNotificationsService} from '@taiga-ui/core';
import {TUI_COPY_TEXTS} from '@taiga-ui/kit';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CodeEditor} from '../../interfaces/code-editor';
import {TuiDocExample, TuiDocExampleProcessed} from '../../interfaces/page';
import {TUI_DOC_CODE_EDITOR} from '../../tokens/code-editor';
import {TUI_DOC_EXAMPLE_CONTENT_PROCESSOR} from '../../tokens/example-content-processor';
import {TUI_DOC_EXAMPLE_TEXTS} from '../../tokens/i18n';

// Ambient type cannot be used without dynamic https://github.com/angular/angular/issues/23395
// @dynamic
@Component({
    selector: 'tui-doc-example',
    templateUrl: './example.template.html',
    styleUrls: ['./example.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiDocExampleComponent {
    @Input()
    heading: PolymorpheusContent = '';

    @Input()
    description: PolymorpheusContent = '';

    @Input()
    set content(content: TuiDocExample) {
        this.prepareContent(content).then(() => this.cd.detectChanges());
    }

    private async prepareContent(content: TuiDocExample): Promise<void> {
        const processedContent: TuiDocExampleProcessed = {};

        for (const [key, value] of Object.entries(content)) {
            if (value instanceof Promise) {
                processedContent[key] = (
                    await (value as Promise<{default: string}>)
                ).default;
            } else {
                processedContent[key] = value;
            }
        }

        this.processedContent = this.processContent(processedContent);
    }

    @Input()
    componentName: string = this.location.pathname.slice(1);

    activeItemIndex = 0;

    processedContent: TuiDocExampleProcessed = {};

    readonly defaultTab = this.texts[0];

    readonly copy$ = this.copyTexts$.pipe(map(([copy]) => copy));

    constructor(
        @Attribute('id')
        readonly id: string | null,
        @Inject(Clipboard) private readonly clipboard: Clipboard,
        @Inject(TuiNotificationsService)
        private readonly notifications: TuiNotificationsService,
        @Inject(LOCATION) private readonly location: Location,
        @Inject(TUI_COPY_TEXTS) private readonly copyTexts$: Observable<[string, string]>,
        @Inject(TUI_DOC_EXAMPLE_TEXTS) readonly texts: [string, string, string],
        @Optional()
        @Inject(TUI_DOC_CODE_EDITOR)
        readonly codeEditor: CodeEditor | null,
        @Inject(TUI_DOC_EXAMPLE_CONTENT_PROCESSOR)
        private readonly processContent: TuiHandler<
            TuiDocExample,
            TuiDocExampleProcessed
        >,
        private readonly cd: ChangeDetectorRef,
    ) {}

    get activeItem(): string {
        return this.tabs[this.activeItemIndex];
    }

    get tabs(): readonly string[] {
        return this.getTabs(this.processedContent);
    }

    get code(): string {
        const code = this.processedContent[this.activeItem];

        return code ? code.trim() : '';
    }

    get isDefaultItem(): boolean {
        return this.activeItem === this.defaultTab;
    }

    copyExampleLink() {
        const hashPosition = this.location.href.indexOf('#');
        const currentUrl =
            hashPosition > -1
                ? this.location.href.substr(0, hashPosition)
                : this.location.href;
        const url = `${currentUrl}#${this.id}`;

        this.clipboard.copy(url);
        this.notifications
            .show(this.texts[1], {
                label: this.texts[2],
                status: TuiNotification.Success,
            })
            .subscribe();
    }

    @tuiPure
    private getTabs(content: TuiDocExampleProcessed): readonly string[] {
        return [this.defaultTab, ...Object.keys(content)];
    }
}
