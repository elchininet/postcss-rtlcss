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

            if (hasSelectorsPrefixed(rule)) {
                addToIgnoreRulesInDiffMode(rule);
            } else {
                parseDeclarations(
                    rule,
                    hasParentRule,
                    sourceDirectiveValue,
                    checkDirective(controlDirectives, CONTROL_DIRECTIVE.RULES),
                    checkDirective(controlDirectives, CONTROL_DIRECTIVE.URLS)
                );
            }
            
            parseRules(
                rule,
                parentSourceDirective,
                true
            );
        
        }
    );

};