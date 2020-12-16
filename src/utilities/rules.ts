import { Rule, AtRule, Node, Declaration } from 'postcss';
import { ObjectWithProps, StringMap, Autorename } from '@types';
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
                const decl = node as Declaration;
                if (decl.raws && decl.raws.value && RTL_COMMENT_REGEXP.test(decl.raws.value.raw)) {
                    delete decl.raws.value;
                    decl.value = decl.value.trim();
                }
            }
        });
    });
};

export const appendRules = (): void => {
    const { rules } = store; 
    rules.forEach(({rule, ruleLTR, ruleRTL, ruleBoth, ruleSafe}): void => {
        ruleBoth && ruleBoth.nodes.length && rule.after(ruleBoth);
        ruleRTL && ruleRTL.nodes.length && rule.after(ruleRTL);
        ruleLTR && ruleLTR.nodes.length && rule.after(ruleLTR);
        ruleSafe && ruleSafe.nodes.length && rule.after(ruleSafe);
        const ruleHasDeclarations = rule.some((node: Node) => node.type === DECLARATION_TYPE);      
        if (!ruleHasDeclarations) {
            rule.remove();
        }
        cleanRules(rule, ruleLTR, ruleRTL, ruleBoth, ruleSafe);
    }); 
};

export const appendKeyFrames = (): void => {
    const { keyframes } = store;
    keyframes.forEach(({atRule, atRuleFlipped}): void => {
        atRule.after(atRuleFlipped);
        cleanRules(atRule, atRuleFlipped);
    }); 
};

export const appendAutorenameRules = (): void => {

    if (!store.rulesAutoRename.length) {
        return;
    }

    const replaceHash: ObjectWithProps<string> = store.options.stringMap.reduce((hash: ObjectWithProps<string>, map: StringMap): ObjectWithProps<string> => {
        const search = typeof map.search === 'string' ? [map.search] : map.search;
        const replace = typeof map.replace === 'string' ? [map.replace] : map.replace;
        search.forEach((s: string, index: number): void => {
            hash[s] = replace[index];
            hash[replace[index]] = s;
        });
        return hash;
    }, {});
    
    const replaces = Object.keys(replaceHash).join('|');
    const replaceRegExp = store.options.greedy
        ? new RegExp(`(${replaces})`, 'g')
        : new RegExp(`\\b(${replaces})\\b`, 'g');

    const rulesHash: ObjectWithProps<boolean> = {};
    const rulesToProcess: Rule[] = [];

    store.rulesAutoRename.forEach((rule: Rule): void => {
        let process = false;
        rule.selectors.forEach((selector: string): void => {
            if (replaceRegExp.test(selector)) {
                rulesHash[selector] = true;
                process = true;
            }
            replaceRegExp.lastIndex = 0;
        });
        if (process) {
            rulesToProcess.push(rule);
        }
    });

    rulesToProcess.forEach((rule: Rule): void => {

        rule.selectors = rule.selectors.map((selector: string): string => {

            const flip = selector.replace(replaceRegExp, (match: string, group: string): string => replaceHash[group]);
            
            if (
                store.options.autoRename !== Autorename.strict ||
                (store.options.autoRename === Autorename.strict && rulesHash[flip])
            ) {
                return flip;
            }

            return selector;

        });

    });

};