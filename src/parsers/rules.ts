import postcss, {
    Container,
    Rule,
    Comment
} from 'postcss';
import {
    ControlDirective,
    Source,
    Mode,
    Parsers
} from '@types';
import { TYPE, CONTROL_DIRECTIVE } from '@constants';
import { store } from '@data/store';
import {
    isIgnoreDirectiveInsideAnIgnoreBlock,
    checkDirective,
    getSourceDirectiveValue
} from '@utilities/directives';
import { walkContainer } from '@utilities/containers';
import { cleanRuleRawsBefore, addToIgnoreRulesInDiffMode } from '@utilities/rules';
import { addSelectorPrefixes, hasSelectorsPrefixed } from '@utilities/selectors';

export const parseRules = (
    parsers: Parsers,
    container: Container,
    parentSourceDirective: string = undefined,
    parentFreezeDirectiveActive: boolean = false,
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

            const freezeDirectiveActive = (
                checkDirective(controlDirectives, CONTROL_DIRECTIVE.FREEZE) ||
                parentFreezeDirectiveActive
            );

            if (freezeDirectiveActive) {
                if (mode === Mode.combined) {
                    addSelectorPrefixes(
                        node,
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
                            ? ltrPrefix
                            : rtlPrefix
                    );
                }
                addToIgnoreRulesInDiffMode(node);
                return;
            }

            if (hasSelectorsPrefixed(node)) {
                addToIgnoreRulesInDiffMode(node);
            } else {
                parsers.parseDeclarations(
                    node,
                    hasParentRule,
                    sourceDirectiveValue,
                    freezeDirectiveActive,
                    checkDirective(controlDirectives, CONTROL_DIRECTIVE.RULES),
                    checkDirective(controlDirectives, CONTROL_DIRECTIVE.URLS)
                );
            }

            parsers.parseAtRules(
                parsers,
                node,
                sourceDirectiveValue,
                freezeDirectiveActive,
                true
            );
            
            parsers.parseRules(
                parsers,
                node,
                sourceDirectiveValue,
                freezeDirectiveActive,
                true
            );
        
        }
    );

};