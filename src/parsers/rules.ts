import postcss, { Container, Node, Rule, Comment } from 'postcss';
import { ObjectWithProps, ControlDirective, Source } from '@types';
import { RULE_TYPE, CONTROL_DIRECTIVE } from '@constants';
import { store } from '@data/store';
import { isIgnoreDirectiveInsideAnIgnoreBlock, checkDirective } from '@utilities/directives';
import { walkContainer } from '@utilities/containers';
import { cleanRuleRawsBefore } from '@utilities/rules';
import { addSelectorPrefixes } from '@utilities/selectors';
import { parseDeclarations } from './declarations';

export const parseRules = (container: Container): void => {

    const controlDirectives: ObjectWithProps<ControlDirective> = {};
    const { source, ltrPrefix, rtlPrefix } = store.options;

    walkContainer(
        container,
        [ RULE_TYPE ],
        (comment: Comment, controlDirective: ControlDirective): void => {

            if (controlDirective.directive === CONTROL_DIRECTIVE.RAW && controlDirective.raw) {
                const root = postcss.parse(controlDirective.raw);
                root.walkRules((rule: Rule): void => {
                    addSelectorPrefixes(rule, source === Source.ltr ? rtlPrefix : ltrPrefix);
                });
                comment.replaceWith(root.nodes);
                return;
            }

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