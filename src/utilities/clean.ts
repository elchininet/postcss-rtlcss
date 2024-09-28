import {
    Container,
    Node,
    Rule,
    AtRule
} from 'postcss';
import { store } from '@data/store';
import { KEYFRAMES_NAME } from '@constants';
import { Mode, RulesObject } from '@types';
import { vendor } from '@utilities/vendor';
import {
    isAtRule,
    isComment,
    isRule
} from '@utilities/predicates';
import { ruleHasChildren, cleanRuleRawsBefore } from '@utilities/rules';

export const clean = (css: Container): void => {
    const {
        options,
        rules,
        rulesToRemove,
        keyframes,
        keyframesToRemove
    } = store;
    const { mode, processKeyFrames } = options;
    if (mode === Mode.diff) {
        rules.forEach((rulesObject: RulesObject): void => {
            rulesObject.rule.remove();
        });
        rulesToRemove.forEach((rule: Rule) => {
            rule.remove();
        });
        keyframes.forEach(({atRule}): void => {
            atRule.remove();
        });
        keyframesToRemove.forEach((keyframe: AtRule): void => {
            keyframe.remove();
        });
    }
    css.walk((node: Node): void => {
        if (mode === Mode.diff) {
            if (isComment(node)) {
                node.remove();
            } else if (
                isAtRule(node) &&
                !processKeyFrames &&
                vendor.unprefixed(node.name) === KEYFRAMES_NAME
            ) {
                node.remove();
            }
        }
        if (
            (
                isRule(node) ||
                isAtRule(node)
            ) &&
            !!node.nodes
        ) {
            if (!ruleHasChildren(node)) {
                if (mode === Mode.diff) {
                    node.remove();
                }
            } else {
                const prev = node.prev();
                if (prev) {
                    if (!isComment(prev)) {
                        cleanRuleRawsBefore(node);
                    }
                } else {
                    cleanRuleRawsBefore(
                        node,
                        node.parent === css
                            ? ''
                            : '\n'
                    );
                }
            }
        }
    });
};