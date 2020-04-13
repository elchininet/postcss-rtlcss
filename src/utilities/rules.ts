import { Rule, AtRule, Node } from 'postcss';
import { RulesObject, AtRulesObject } from '@types';
import { COMMENT_TYPE, RTL_COMMENT_REGEXP, DECLARATION_TYPE, RULE_TYPE } from '@constants';

export const cleanRuleRawsBefore = (node: Node | void): void => {
    if (node && node.type === RULE_TYPE) {
        node.raws.before = '\n\n' + node.raws.before.replace(/\n/g, '');      
    }
};

export const cleanRules = (...rules: (Rule | AtRule | undefined | null)[]): void => {
    rules.forEach((rule: Rule | undefined | null): void | undefined => {        
        const prev = rule.prev();
        if (prev && prev.type !== COMMENT_TYPE) {
            cleanRuleRawsBefore(rule);
        }
        rule.walk((node: Node): void => {
            if (node.type === DECLARATION_TYPE) {
                // @ts-ignore
                if (node.raws && node.raws.value && RTL_COMMENT_REGEXP.test(node.raws.value.raw)) {
                    // @ts-ignore
                    delete node.raws.value;
                    node.value = node.value.trim();
                }
            }
        });
    });
};

export const appendRules = (rules: RulesObject[]): void => {
    rules.forEach(({rule, ruleLTR, ruleRTL}): void => {
        ruleRTL && ruleRTL.nodes.length && rule.after(ruleRTL);
        ruleLTR && ruleLTR.nodes.length && rule.after(ruleLTR);
        if (rule.nodes.length === 0) {
            rule.remove();
        }
        cleanRules(rule, ruleLTR, ruleRTL);
    }); 
};

export const appendKeyFrames = (rules: AtRulesObject[]): void => {
    rules.forEach(({atRule, atRuleFlipped}): void => {
        atRule.after(atRuleFlipped);
        cleanRules(atRule, atRuleFlipped);
    }); 
};