import {
    Rule,
    AtRule,
    Declaration
} from 'postcss';

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

export type PrefixSelectorTransformer = (prefix: string, selector: string) => string | void;

export interface PluginOptions {
    mode?: ModeValues;
    ltrPrefix?: strings;
    rtlPrefix?: strings;
    bothPrefix?: strings;
    prefixSelectorTransformer?: PrefixSelectorTransformer;
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

export interface PluginOptionsNormalized extends Omit<Required<PluginOptions>, 'stringMap' | 'prefixSelectorTransformer'> {
    stringMap: StringMap[];
    prefixSelectorTransformer: PrefixSelectorTransformer | null;
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

export type DeclarationHashMapDetails = {
    decl: Declaration;
    value: string;
    ignore: boolean;
};

export type DeclarationHashMapProp = {
    ignore: boolean;
    indexes: Record<string,DeclarationHashMapDetails>;
};

export type DeclarationHashMap = Record<
    string,
    DeclarationHashMapProp
>;