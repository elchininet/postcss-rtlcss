import {
    Container,
    Node,
    Rule,
    AtRule
} from 'postcss';
import { store } from '@data/store';
import {
    COMMENT_TYPE,
    RULE_TYPE,
    AT_RULE_TYPE,
    KEYFRAMES_NAME
} from '@constants';
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
    if (mode !== Mode.diff) return;
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
    css.walk((node: Node): void => {
        if (node.type === COMMENT_TYPE) {
            node.remove();
        } else if (
            node.type === AT_RULE_TYPE &&
            !processKeyFrames &&
            vendor.unprefixed((node as AtRule).name) === KEYFRAMES_NAME
        ) {
            node.remove(); 
        } else if (
            node.type === RULE_TYPE ||
            node.type === AT_RULE_TYPE
        ) {
            if (!ruleHasChildren(node as Container)) {
                node.remove(); 
            } else if (node.parent === css) {
                cleanRuleRawsBefore(node);
            }                              
        }
    });
};