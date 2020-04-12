import { Rule, Node } from 'postcss';
import { RulesObject } from '@types';
import { COMMENT_TYPE, RTL_COMMENT_REGEXP, DECLARATION_TYPE, RULE_TYPE } from '@constants';

export const cleanRuleRawsBefore = (node: Node | void): void => {
    if (node && node.type === RULE_TYPE) {
        node.raws.before = '\n\n';
    }
};

export const cleanRules = (...rules: (Rule | undefined | null)[]): void => {
    rules.forEach((rule: Rule | undefined | null): void | undefined => {
        if (rule) {
            const prev = rule.prev();
            if (prev && prev.type !== COMMENT_TYPE) {
                cleanRuleRawsBefore(rule);
            }
            rule.walk((node: Node): void => {
                if (node.type === COMMENT_TYPE) {
                    if (RTL_COMMENT_REGEXP.test(node.toString())) {
                        node.remove();                
                    }
                }
                if (node.type === DECLARATION_TYPE) {
                    // @ts-ignore
                    if (node.raws && node.raws.value && RTL_COMMENT_REGEXP.test(node.raws.value.raw)) {
                        // @ts-ignore
                        delete node.raws.value;
                        node.value = node.value.trim();
                    }
                }
            });
        }
    });
};

export const appendRules = (rules: RulesObject[]): void => {
    rules.forEach(({rule, ruleLTR, ruleRTL}): void => {
        ruleRTL && rule.after(ruleRTL);
        ruleLTR && rule.after(ruleLTR);
        if (rule.nodes.length === 0) {
            rule.remove();
        }
        cleanRules(rule, ruleLTR, ruleRTL);
    }); 
};