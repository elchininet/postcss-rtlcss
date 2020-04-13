import { Rule, AtRule } from 'postcss';

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
    processKeyFrames?: boolean;
    useCalc?: boolean;
    stringMap?: PluginStringMap[];
}

export interface PluginOptionsNormalized extends Omit<Required<PluginOptions>, 'stringMap'> {
    stringMap: StringMap[];
}

export interface RulesObject {
    rule: Rule;
    ruleLTR: Rule | null;
    ruleRTL: Rule | null;
}

export interface AtRulesObject {
    atRuleParams: string;
    atRule: AtRule;
    atRuleFlipped: AtRule;
}

export interface AtRulesStringMapObject {
    name: string;
    nameFlipped: string;
}

export interface AtRulesStringMap {
    [key: string]: AtRulesStringMapObject;
}

export interface KeyFramesData {
    length: number;
    keyframes: AtRulesObject[];
    stringMap: AtRulesStringMap;
    regExp: RegExp;
}