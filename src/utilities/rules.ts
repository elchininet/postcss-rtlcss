import { Rule, AtRule, Node } from 'postcss';
import { COMMENT_TYPE, RTL_COMMENT_REGEXP, DECLARATION_TYPE, RULE_TYPE } from '@constants';
import { store } from '@data/store';

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

export const appendRules = (): void => {
    const { rules } = store; 
    rules.forEach(({rule, ruleLTR, ruleRTL, ruleBoth}): void => {
        ruleBoth && ruleBoth.nodes.length && rule.after(ruleBoth);
        ruleRTL && ruleRTL.nodes.length && rule.after(ruleRTL);
        ruleLTR && ruleLTR.nodes.length && rule.after(ruleLTR);        
        if (rule.nodes.length === 0) {
            rule.remove();
        }
        cleanRules(rule, ruleLTR, ruleRTL, ruleBoth);
    }); 
};

export const appendKeyFrames = (): void => {
    const { keyframes } = store;
    keyframes.forEach(({atRule, atRuleFlipped}): void => {
        atRule.after(atRuleFlipped);
        cleanRules(atRule, atRuleFlipped);
    }); 
};