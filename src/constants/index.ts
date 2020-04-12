export const COMMENT_TYPE = 'comment';
export const DECLARATION_TYPE = 'decl';
export const RULE_TYPE = 'rule';
export const STRING_TYPE = 'string';
export const BOOLEAN_TYPE = 'boolean';
export const RTL_COMMENT_REGEXP = /rtl:/;
export const RTL_COMMENT_IGNORE_REGEXP = /^\/\*!? *rtl(?::(\w+))?:ignore *\*\/$/;
export const FLIP_PROPERTY_REGEXP = /(right|left)/i;

export enum IGNORE_MODE {
    DISABLED,
    NEXT_NODE,
    BLOCK_MODE
}

export const IGNORE_NEXT = 'ignore';
export const IGNORE_BEGIN = 'begin';
export const IGNORE_END = 'end';