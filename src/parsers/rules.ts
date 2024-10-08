import postcss, {
    Container,
    Rule,
    Comment
} from 'postcss';
import {
    ControlDirective,
    Source,
    Mode
} from '@types';
import { TYPE, CONTROL_DIRECTIVE } from '@constants';
import { store } from '@data/store';
import {
    isIgnoreDirectiveInsideAnIgnoreBlock,
    checkDirective,
    getSourceDirectiveValue
} from '@utilities/directives';
import { walkContainer } from '@utilities/containers';
import { cleanRuleRawsBefore } from '@utilities/rules';
import { addSelectorPrefixes, hasSelectorsPrefixed } from '@utilities/selectors';
import { parseAtRules } from './atrules';
import { parseDeclarations } from './declarations';

const addToIgnoreRulesInDiffMode = (rule: Rule): void => {
    if (store.options.mode === Mode.diff) {
        store.containersToRemove.push(rule);
    }
};

export const parseRules = (
    container: Container,
    parentSourceDirective: string = undefined,
    hasParentRule = false
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
        [ TYPE.RULE ],
        (comment: Comment, controlDirective: ControlDirective): void => {
            
            if (
                controlDirective.directive === CONTROL_DIRECTIVE.RAW &&
                controlDirective.option
            ) {
                const sourceDirectiveValue = getSourceDirectiveValue(controlDirectives);
                /* the source could be undefined in certain cases but not during the tests */
                /* istanbul ignore next */
                const root = postcss.parse(
                    controlDirective.option,
                    {
                        from: container.source?.input?.from
                    }
                );
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
        (node: Rule): void => {

            if ( checkDirective(controlDirectives, CONTROL_DIRECTIVE.IGNORE) ) {
                addToIgnoreRulesInDiffMode(node);
                return;
            }
            
            const sourceDirectiveValue = getSourceDirectiveValue(
                controlDirectives,
                parentSourceDirective
            );

            if (hasSelectorsPrefixed(node)) {
                addToIgnoreRulesInDiffMode(node);
            } else {
                parseDeclarations(
                    node,
                    hasParentRule,
                    sourceDirectiveValue,
                    checkDirective(controlDirectives, CONTROL_DIRECTIVE.RULES),
                    checkDirective(controlDirectives, CONTROL_DIRECTIVE.URLS)
                );
            }

            parseAtRules(
                node,
                parentSourceDirective,
                true
            );
            
            parseRules(
                node,
                parentSourceDirective,
                true
            );
        
        }
    );

};