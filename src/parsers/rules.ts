import { Root, Node, Rule } from 'postcss';
import { RULE_TYPE } from '@constants';
import { walkContainer } from '@utilities/containers';
import { parseDeclarations } from './declarations';

export const parseRules = (css: Root): void => {

    walkContainer(css, [ RULE_TYPE ], true, (node: Node): void => {
        const rule = node as Rule;
        parseDeclarations(rule);
    });    

};