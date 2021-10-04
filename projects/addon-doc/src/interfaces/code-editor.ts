import {TuiDocExampleProcessed} from './page';

export interface CodeEditor {
    readonly name: string;

    open(component: string, sampleId: string, files: TuiDocExampleProcessed): void;
}
