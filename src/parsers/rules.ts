import { Container, Node, Rule, Comment } from 'postcss';
import { ObjectWithProps, ControlDirective } from '@types';
import { RULE_TYPE, CONTROL_DIRECTIVE } from '@constants';
import { store } from '@data/store';
import { isIgnoreDirectiveInsideAnIgnoreBlock, checkDirective } from '@utilities/directives';
import { walkContainer } from '@utilities/containers';
import { cleanRuleRawsBefore } from '@utilities/rules';
import { parseDeclarations } from './declarations';

export const parseRules = (container: Container): void => {

    const controlDirectives: ObjectWithProps<ControlDirective> = {};

    walkContainer(
        container,
        [ RULE_TYPE ],
        (comment: Comment, controlDirective: ControlDirective): void => {

            cleanRuleRawsBefore(comment.next());              
            comment.remove(); 

            if (isIgnoreDirectiveInsideAnIgnoreBlock(controlDirective, controlDirectives)) {
                return;
            }

            controlDirectives[controlDirective.directive] = controlDirective;

        },
        (node: Node): void => {

            if ( checkDirective(controlDirectives, CONTROL_DIRECTIVE.IGNORE) ) {
                return;
            }
        
            const rule = node as Rule;

            if (checkDirective(controlDirectives, CONTROL_DIRECTIVE.RENAME)) {
                store.rulesAutoRename.push(rule);
                parseDeclarations(rule, true);
            } else {
                parseDeclarations(rule);
            }           
        
        }
    );    

};