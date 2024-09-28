import postcss, {
    Root,
    Container,
    Node,
    AtRule,
    Comment
} from 'postcss';
import rtlcss from 'rtlcss';
import {
    Source,
    ControlDirective,
    Mode
} from '@types';
import {
    TYPE,
    KEYFRAMES_NAME,
    CONTROL_DIRECTIVE
} from '@constants';
import {
    store,
    initKeyframesData
} from '@data/store';
import { walkContainer } from '@utilities/containers';
import {
    isIgnoreDirectiveInsideAnIgnoreBlock,
    checkDirective,
    getSourceDirectiveValue
} from '@utilities/directives';
import { isAtRule } from '@utilities/predicates';
import { vendor } from '@utilities/vendor';
import { parseRules } from '@parsers/rules';

export const parseAtRules = (container: Container): void => {

    const controlDirectives: Record<string, ControlDirective> = {};

    walkContainer(
        container,
        [ TYPE.AT_RULE, TYPE.RULE ],
        (_comment: Comment, controlDirective: ControlDirective): void => {

            if (isIgnoreDirectiveInsideAnIgnoreBlock(controlDirective, controlDirectives)) {
                return;
            }

            controlDirectives[controlDirective.directive] = controlDirective;

        },
        (node: Node): void => {

            if ( checkDirective(controlDirectives, CONTROL_DIRECTIVE.IGNORE) ) {
                return;
            }
        
            if (!isAtRule(node)) return;

            if (vendor.unprefixed(node.name) === KEYFRAMES_NAME) return;

            const sourceDirectiveValue = getSourceDirectiveValue(controlDirectives);

            parseRules(node, sourceDirectiveValue);

            parseAtRules(node);

        }
    );

};

const addToIgnoreKeyframesInDiffMode = (node: AtRule): void => {
    if (store.options.mode === Mode.diff) {
        store.keyframesToRemove.push(node);
    }
};

export const parseKeyFrames = (css: Root): void => {

    const { source, processUrls, useCalc, stringMap, processKeyFrames } = store.options;

    if (!processKeyFrames) {
        return;
    }

    const controlDirectives: Record<string, ControlDirective> = {};

    walkContainer(
        css,
        [ TYPE.AT_RULE, TYPE.RULE ],
        (_comment: Comment, controlDirective: ControlDirective): void => {

            if (isIgnoreDirectiveInsideAnIgnoreBlock(controlDirective, controlDirectives)) {
                return;
            }

            controlDirectives[controlDirective.directive] = controlDirective;

        },
        (node: Node): void => {

            if ( checkDirective(controlDirectives, CONTROL_DIRECTIVE.IGNORE) ) {
                addToIgnoreKeyframesInDiffMode(node as AtRule);
                return;
            }

            if (!isAtRule(node)) {
                return;
            }
            
            if (vendor.unprefixed(node.name) !== KEYFRAMES_NAME) {
                return;
            }
            
            const atRuleString = node.toString();
            const atRuleFlippedString = rtlcss.process(atRuleString, { processUrls, useCalc, stringMap });
            
            if (atRuleString === atRuleFlippedString) {
                addToIgnoreKeyframesInDiffMode(node);
                return;
            }

            /* the source could be undefined in certain cases but not during the tests */
            /* istanbul ignore next */
            const rootFlipped = postcss.parse(
                atRuleFlippedString,
                {
                    from: node.source?.input?.from
                }
            );
            const atRuleFlipped = rootFlipped.first as AtRule;

            const atRuleParams = node.params;
            const ltr = `${atRuleParams}-${Source.ltr}`;
            const rtl = `${atRuleParams}-${Source.rtl}`;
            const sourceDirectiveValue = getSourceDirectiveValue(controlDirectives);
            
            node.params = (
                (
                    !sourceDirectiveValue &&
                    source === Source.ltr
                ) ||
                (
                    sourceDirectiveValue &&
                    sourceDirectiveValue === Source.ltr
                )
            )
                ? ltr
                : rtl;
            
            atRuleFlipped.params = (
                (
                    !sourceDirectiveValue &&
                    source === Source.ltr
                ) ||
                (
                    sourceDirectiveValue &&
                    sourceDirectiveValue === Source.ltr
                )
            )
                ? rtl
                : ltr;

            store.keyframes.push({
                atRuleParams,
                atRule: node,
                atRuleFlipped
            });
        
        }
    );

    initKeyframesData();

};