export const KEYFRAMES_NAME = 'keyframes';
export const ANIMATION_PROP = 'animation';
export const ANIMATION_NAME_PROP = 'animation-name';
export const RTL_COMMENT_REGEXP = /rtl:/;
export const RTL_COMMENT_IGNORE_REGEXP = /rtl:ignore/;
export const RTL_CONTROL_DIRECTIVE_REG_EXP = /^\/\*!? *rtl:?(begin|end)?:(\w+):?([\s\S]*?) *\*\/$/;
export const FLIP_PROPERTY_REGEXP = /(right|left)/i;
export const HTML_SELECTOR_REGEXP = /^(html)(?=\W|$)/;
export const ROOT_SELECTOR_REGEXP = /(:root)(?=\W|$)/;
export const VIEW_TRANSITION_REGEXP = /^(::view-transition(?:-(?:new|old|group|image-pair))?\()/;
export const REG_EXP_CHARACTERS_REG_EXP = /[.?*+^$[\]\\(){}|-]/g;
export const LAST_WORD_CHARACTER_REG_EXP = /\w$/;

export enum TYPE {
    AT_RULE = 'atrule',
    COMMENT = 'comment',
    DECLARATION = 'decl',
    RULE = 'rule'
}

export enum TYPEOF {
    BOOLEAN = 'boolean',
    FUNCTION = 'function',
    NUMBER = 'number',
    STRING = 'string'
}

export enum CONTROL_DIRECTIVE {
    IGNORE = 'ignore',
    URLS = 'urls',
    RULES = 'rules',
    SOURCE = 'source',
    RAW = 'raw'
}

export enum CONTROL_DIRECTIVE_BLOCK {
    BEGIN = 'begin',
    END = 'end'
}