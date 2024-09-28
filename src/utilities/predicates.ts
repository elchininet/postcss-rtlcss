import {
    AtRule,
    Comment,
    Declaration,
    Node,
    Rule
} from 'postcss';
import { DeclarationContainer } from '@types';
import { TYPE, TYPEOF } from '@constants';

type FunctionType = (...args: unknown[]) => unknown;

export const isAtRule = (node: Node): node is AtRule => node.type === TYPE.AT_RULE;
export const isComment = (node: Node): node is Comment => node.type === TYPE.COMMENT;
export const isDeclaration = (node: Node): node is Declaration => node.type === TYPE.DECLARATION;
export const isRule = (node: Node): node is Rule => node.type === TYPE.RULE;
export const isDeclarationContainer = (node: Node): node is DeclarationContainer => isRule(node) || isAtRule(node);

export const isBoolean = (value: unknown): value is boolean => typeof value === TYPEOF.BOOLEAN;
export const isFunction = (value: unknown): value is FunctionType => typeof value === TYPEOF.FUNCTION;
export const isNumber = (value: unknown): value is number => typeof value === TYPEOF.NUMBER;
export const isString = (value: unknown): value is string => typeof value === TYPEOF.STRING;