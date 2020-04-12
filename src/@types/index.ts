import { Rule } from 'postcss';

export enum Mode {
    combined = 'combined',
    override = 'override'
}

export enum Source {
    ltr = 'ltr',
    rtl = 'rtl'
}

export type ModeValues = keyof typeof Mode;
export type SourceValues = keyof typeof Source;

export type strings = string | string[];

interface StringMapOptions {
    scope: '*' | 'selector' | 'url';
    ignoreCase: boolean;
}

export interface StringMap {
    name: string;
    priority: number;
    search: strings;
    replace: strings;
    options: StringMapOptions;
}

export interface PluginStringMap {
    search: strings;
    replace: strings;
}

export interface PluginOptions {
    mode?: ModeValues;
    ltrPrefix?: strings;
    rtlPrefix?: strings;
    source?: SourceValues;
    processUrls?: boolean;
    useCalc?: boolean;
    stringMap?: PluginStringMap[];
}

export interface PluginOptionsParsed extends Omit<Required<PluginOptions>, 'stringMap'> {
    stringMap: StringMap[];
}

export interface RulesObject {
    rule: Rule;
    ruleLTR: Rule | null;
    ruleRTL: Rule | null;
}