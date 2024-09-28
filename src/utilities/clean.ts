import {
    Container,
    Node,
    Rule,
    AtRule
} from 'postcss';
import { store } from '@data/store';
import { TYPE, KEYFRAMES_NAME } from '@constants';
import { Mode, RulesObject } from '@types';
import { vendor } from '@utilities/vendor';
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
            if (node.type === TYPE.COMMENT) {
                node.remove();
            } else if (
                node.type === TYPE.AT_RULE &&
                !processKeyFrames &&
                vendor.unprefixed((node as AtRule).name) === KEYFRAMES_NAME
            ) {
                node.remove();
            }
        }
        if (
            (
                node.type === TYPE.RULE ||
                node.type === TYPE.AT_RULE
            ) &&
            !!(node as Container).nodes
        ) {
            if (!ruleHasChildren(node as Container)) {
                if (mode === Mode.diff) {
                    node.remove();
                }
            } else {
                const prev = node.prev();
                if (prev) {
                    if (prev.type !== TYPE.COMMENT) {
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