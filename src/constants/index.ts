export const COMMENT_TYPE = 'comment';
export const DECLARATION_TYPE = 'decl';
export const RULE_TYPE = 'rule';
export const AT_RULE_TYPE = 'atrule';
export const STRING_TYPE = 'string';
export const BOOLEAN_TYPE = 'boolean';
export const KEYFRAMES_NAME = 'keyframes';
export const ANIMATION_PROP = 'animation';
export const ANIMATION_NAME_PROP = 'animation-name';
export const RTL_COMMENT_REGEXP = /rtl:/;
export const RTL_COMMENT_IGNORE_REGEXP = /rtl:ignore/;
export const RTL_CONTROL_DIRECTIVE_REG_EXP = /^\/\*!? *rtl:?(begin|end)?:(\w+):?([^*]*?) *\*\/$/;
export const FLIP_PROPERTY_REGEXP = /(right|left)/i;
export const HTML_SELECTOR_REGEXP = /^(html)(?=\W|$)/;
export const ROOT_SELECTOR_REGEXP = /(:root)(?=\W|$)/;

export enum CONTROL_DIRECTIVE {
    IGNORE = 'ignore',
    RENAME = 'rename',
    SOURCE = 'source',
    RAW = 'raw'
}

export enum CONTROL_DIRECTIVE_BLOCK {
    BEGIN = 'begin',
    END = 'end'
}