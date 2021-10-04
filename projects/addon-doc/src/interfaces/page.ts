export interface TuiDocPageBase {
    readonly section?: string;
    readonly title: string;
}

export interface TuiDocPage extends TuiDocPageBase {
    readonly route: string;
    readonly keywords?: string;
}

export interface TuiDocPageGroup extends TuiDocPageBase {
    readonly subPages: ReadonlyArray<TuiDocPage>;
}

export type TuiDocCodeValue = string | Promise<{default: string}> | null | undefined;
export type TuiDocCodeProcessedValue = string | null | undefined;

export interface TuiDocExample extends Record<string, TuiDocCodeValue> {
    TypeScript?: TuiDocCodeValue;
    HTML?: TuiDocCodeValue;
    LESS?: TuiDocCodeValue;
}

export type TuiDocExampleProcessed = Record<string, TuiDocCodeProcessedValue>;
