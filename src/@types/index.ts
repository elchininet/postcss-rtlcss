import { Rule, AtRule } from 'postcss';

export enum Mode {
    combined = 'combined',
    override = 'override',
    diff = 'diff'
}

export enum Source {
    ltr = 'ltr',
    rtl = 'rtl'
}

export enum Autorename {
    disabled = 'disabled',
    flexible = 'flexible',
    strict = 'strict'
}

export type ModeValues = keyof typeof Mode;
export type SourceValues = keyof typeof Source;
export type AutorenameValues = keyof typeof Autorename;

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
    name?: string;
    search: strings;
    replace: strings;
}

export interface PluginOptions {
    mode?: ModeValues;
    ltrPrefix?: strings;
    rtlPrefix?: strings;
    bothPrefix?: strings;
    safeBothPrefix?: boolean;
    ignorePrefixedRules?: boolean;
    source?: SourceValues;
    processUrls?: boolean;
    processKeyFrames?: boolean;
    processEnv?: boolean;
    useCalc?: boolean;
    stringMap?: PluginStringMap[];
    autoRename?: AutorenameValues;
    greedy?: boolean;
    aliases?: Record<string, string>;
}

export interface PluginOptionsNormalized extends Omit<Required<PluginOptions>, 'stringMap'> {
    stringMap: StringMap[];
}

export interface RulesObject {
    rule: Rule;
    ruleLTR: Rule;
    ruleRTL: Rule;
    ruleBoth: Rule;
    ruleSafe: Rule;
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

export interface DeclarationsData {
    [key: string]: {
        overridden: string | null;
        overrides: string[];
    };
}

export interface ControlDirective {
    block?: string;
    directive: string;
    option?: string;
}