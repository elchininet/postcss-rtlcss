import { Root, Node, Rule } from 'postcss';
import { ObjectWithProps, ControlDirective } from '@types';
import { store } from '@data/store';
import { RULE_TYPE, CONTROL_DIRECTIVE, CONTROL_DIRECTIVE_BLOCK } from '@constants';
import { resetDirective } from '@utilities/directives';
import { walkContainer } from '@utilities/containers';
import { parseDeclarations } from './declarations';

export const parseRules = (css: Root): void => {

    walkContainer(css, [ RULE_TYPE ], true, (node: Node, containerDirectives?: ObjectWithProps<ControlDirective>): void => {
        
        const rule = node as Rule;

        const RENAME = containerDirectives[CONTROL_DIRECTIVE.RENAME];

        if (RENAME && RENAME.directive) {
            const { block } = RENAME;
            resetDirective(RENAME);
            if (block !== CONTROL_DIRECTIVE_BLOCK.END) {
                store.rulesAutoRename.push(rule);
                parseDeclarations(rule, true);
            } else {
                parseDeclarations(rule);
            }
        } else {
            parseDeclarations(rule);
        }
        
    });    

};