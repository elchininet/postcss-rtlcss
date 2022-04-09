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
    AT_RULE_TYPE,
    RULE_TYPE,
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
import { vendor } from '@utilities/vendor';
import { parseRules } from '@parsers/rules';

export const parseAtRules = (container: Container): void => {

    const controlDirectives: Record<string, ControlDirective> = {};

    walkContainer(
        container,
        [ AT_RULE_TYPE, RULE_TYPE ],
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
        
            if (node.type !== AT_RULE_TYPE) return;

            const atRule = node as AtRule;

            if (vendor.unprefixed(atRule.name) === KEYFRAMES_NAME) return;

            const sourceDirectiveValue = getSourceDirectiveValue(controlDirectives);

            parseRules(atRule, sourceDirectiveValue);

            parseAtRules(atRule);

        }
    );

};

const addToIgnoreKeyframesInDiffMode = (node: Node): void => {
    if (store.options.mode === Mode.diff) {
        store.keyframesToRemove.push(node as AtRule);
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
        [ AT_RULE_TYPE, RULE_TYPE ],
        (_comment: Comment, controlDirective: ControlDirective): void => {

            if (isIgnoreDirectiveInsideAnIgnoreBlock(controlDirective, controlDirectives)) {
                return;
            }

            controlDirectives[controlDirective.directive] = controlDirective;

        },
        (node: Node): void => {

            if ( checkDirective(controlDirectives, CONTROL_DIRECTIVE.IGNORE) ) {
                addToIgnoreKeyframesInDiffMode(node);
                return;
            }

            if (node.type !== AT_RULE_TYPE) {
                return;
            }

            const atRule = node as AtRule;
            
            if (vendor.unprefixed(atRule.name) !== KEYFRAMES_NAME) {
                return;
            }
            
            const atRuleString = atRule.toString();
            const atRuleFlippedString = rtlcss.process(atRuleString, { processUrls, useCalc, stringMap });
            
            if (atRuleString === atRuleFlippedString) {
                addToIgnoreKeyframesInDiffMode(atRule);
                return;
            }

            const rootFlipped = postcss.parse(atRuleFlippedString);
            const atRuleFlipped = rootFlipped.first as AtRule;

            const atRuleParams = atRule.params;
            const ltr = `${atRuleParams}-${Source.ltr}`;
            const rtl = `${atRuleParams}-${Source.rtl}`;
            const sourceDirectiveValue = getSourceDirectiveValue(controlDirectives);
            
            atRule.params = (
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
                atRule,
                atRuleFlipped
            });
        
        }
    );

    initKeyframesData();

};