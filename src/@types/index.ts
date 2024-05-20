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

export type ModeValue = `${Mode}`;
export type SourceValue = `${Source}`;

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

export type RTLCSSPlugin = {
    name: string;
    priority: number;
    directives: {
        control: object,
        value: Array<object>
    };
}

export interface DeclarationPluginProcessor {
    expr: RegExp;
    action: (prop: string, value: string, context: object) => object;
}

export type DeclarationPlugin = {
    name: string;
    priority: number;
    processors: DeclarationPluginProcessor[];
}

export type PrefixSelectorTransformer = (prefix: string, selector: string) => string | void;

export interface PluginOptions {
    mode?: ModeValue;
    ltrPrefix?: strings;
    rtlPrefix?: strings;
    bothPrefix?: strings;
    prefixSelectorTransformer?: PrefixSelectorTransformer;
    safeBothPrefix?: boolean;
    ignorePrefixedRules?: boolean;
    source?: SourceValue;
    processUrls?: boolean;
    processRuleNames?: boolean;
    processKeyFrames?: boolean;
    processEnv?: boolean;
    useCalc?: boolean;
    stringMap?: PluginStringMap[];
    greedy?: boolean;
    aliases?: Record<string, string>;
    processDeclarationPlugins?: DeclarationPlugin[];
}

export interface PluginOptionsNormalized extends Omit<Required<PluginOptions>, 'stringMap' | 'processDeclarationPlugins' | 'prefixSelectorTransformer'> {
    stringMap: StringMap[];
    plugins: RTLCSSPlugin[];
    prefixSelectorTransformer: PrefixSelectorTransformer | null;
}

export interface RulesObject {
    rule: Rule;
    ruleLTR: Rule;
    ruleRTL: Rule;
    ruleBoth: Rule;
    ruleSafe: Rule;
}

export interface UnmodifiedRulesObject {
    rule: Rule;
    hasParentRule: boolean;
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