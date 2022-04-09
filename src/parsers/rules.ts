import postcss, {
    Container,
    Node,
    Rule,
    Comment
} from 'postcss';
import {
    ControlDirective,
    Source,
    Mode
} from '@types';
import { RULE_TYPE, CONTROL_DIRECTIVE } from '@constants';
import { store } from '@data/store';
import {
    isIgnoreDirectiveInsideAnIgnoreBlock,
    checkDirective,
    getSourceDirectiveValue
} from '@utilities/directives';
import { walkContainer } from '@utilities/containers';
import { cleanRuleRawsBefore } from '@utilities/rules';
import { addSelectorPrefixes, hasSelectorsPrefixed } from '@utilities/selectors';
import { parseDeclarations } from './declarations';

const addToIgnoreRulesInDiffMode = (node: Node): void => {
    if (store.options.mode === Mode.diff) {
        store.rulesToRemove.push(node as Rule);
    }
};

export const parseRules = (
    container: Container,
    parentSourceDirective: string = undefined,
    hasParentRule = false,
): void => {

    const controlDirectives: Record<string, ControlDirective> = {};
    const {
        mode,
        source,
        ltrPrefix,
        rtlPrefix,
    } = store.options;

    walkContainer(
        container,
        [ RULE_TYPE ],
        (comment: Comment, controlDirective: ControlDirective): void => {
            
            if (
                controlDirective.directive === CONTROL_DIRECTIVE.RAW &&
                controlDirective.option
            ) {
                const sourceDirectiveValue = getSourceDirectiveValue(controlDirectives);
                const root = postcss.parse(controlDirective.option);
                if (mode !== Mode.diff) {
                    root.walkRules((rule: Rule): void => {
                        addSelectorPrefixes(
                            rule,
                            (
                                (
                                    !sourceDirectiveValue &&
                                    source === Source.ltr
                                ) ||
                                (
                                    sourceDirectiveValue &&
                                    sourceDirectiveValue === Source.ltr
                                )
                            )
                                ? rtlPrefix
                                : ltrPrefix
                        );
                    });
                }
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
                addToIgnoreRulesInDiffMode(node);
                return;
            }
        
            const rule = node as Rule;
            
            const sourceDirectiveValue = getSourceDirectiveValue(
                controlDirectives,
                parentSourceDirective
            );

            if (checkDirective(controlDirectives, CONTROL_DIRECTIVE.RENAME)) {
                if (!hasSelectorsPrefixed(rule)) {
                    store.rulesAutoRename.push(rule);
                    parseDeclarations(
                        rule,
                        hasParentRule,
                        sourceDirectiveValue,
                        true
                    );
                } else {
                    addToIgnoreRulesInDiffMode(rule);
                }
            } else {
                if (!hasSelectorsPrefixed(rule)) {
                    parseDeclarations(
                        rule,
                        hasParentRule,
                        sourceDirectiveValue
                    );
                } else {
                    addToIgnoreRulesInDiffMode(rule);
                }
            }
            
            parseRules(
                rule,
                parentSourceDirective,
                true
            );
        
        }
    );

};