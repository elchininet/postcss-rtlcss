import {
    Container,
    Rule,
    AtRule,
    Node,
    Declaration
} from 'postcss';
import {
    RulesObject,
    UnmodifiedRulesObject,
    StringMap,
    Mode
} from '@types';
import {
    COMMENT_TYPE,
    RTL_COMMENT_REGEXP,
    DECLARATION_TYPE,
    RULE_TYPE,
    AT_RULE_TYPE
} from '@constants';
import { store } from '@data/store';
import { addProperSelectorPrefixes } from '@utilities/selectors';

export const ruleHasDeclarations = (rule: Rule): boolean => {
    return rule.some(
        (node: Node) => node.type === DECLARATION_TYPE
    );
};

export const ruleHasChildren = (rule: Container): boolean => {
    if (!rule.nodes) return false;
    return rule.some(
        (node: Node) => (
            node.type === DECLARATION_TYPE ||
            (
                node.type === RULE_TYPE &&
                ruleHasChildren(node as Rule)
            ) ||
            (
                node.type === AT_RULE_TYPE &&
                ruleHasChildren(node as AtRule)
            )
        )
    );
};

export const getParentRules = (rule: Rule): Rule[] => {
    const rules: Rule[] = [];
    while (rule.type === RULE_TYPE) {
        rules.push(rule);
        rule = rule.parent as Rule;
    }
    rules.shift();
    return rules.reverse();
};

export const insertRules = (
    parent: Rule,
    rule: Rule,
    rules: Rule[]
): void => {
    if (ruleHasDeclarations(rule)) {
        rules = [...rules];
        let parentRule: Rule;
        while (rules.length) {
            parentRule = rules.shift();
            const innerRule = parent.nodes.find((node: Node): boolean => {
                if (
                    node.type === RULE_TYPE &&
                    (node as Rule).selector === parentRule.selector
                ) {
                    return true;
                }
            }) as Rule | undefined;
            if (innerRule) {
                parentRule = innerRule;
            } else {
                parentRule = parentRule.clone().removeAll();
                parent.append(parentRule);
            }
            parent = parentRule;
        }
        parent.append(rule);
    }
};

export const appendRulesToRuleObject = (
    ruleFlipped: Rule,
    ruleFlippedSecond: Rule,
    ruleBoth: Rule,
    ruleSafe: Rule,
    ruleObject: RulesObject,
    rules: Rule[]
): void => {
    insertRules(
        ruleObject.ruleLTR,
        ruleFlipped,
        rules
    );
    insertRules(
        ruleObject.ruleRTL,
        ruleFlippedSecond,
        rules
    );
    insertRules(
        ruleObject.ruleBoth,
        ruleBoth,
        rules
    );
    insertRules(
        ruleObject.ruleSafe,
        ruleSafe,
        rules
    );
};

export const insertRuleIntoStore = (
    rule: Rule,
    ruleFlipped: Rule,
    ruleFlippedSecond: Rule,
    ruleBoth: Rule,
    ruleSafe: Rule
): RulesObject => {
    const rulesObject = {
        rule,
        ruleLTR: ruleFlipped,
        ruleRTL: ruleFlippedSecond,
        ruleBoth,
        ruleSafe
    };
    if (store.options.mode !== Mode.diff) {
        addProperSelectorPrefixes(
            ruleFlipped,
            ruleFlippedSecond,
            ruleBoth,
            ruleSafe
        );
    }
    store.rules.push(rulesObject);
    return rulesObject;
};

export const appendParentRuleToStore = (
    rule: Rule,
    ruleFlipped: Rule,
    ruleFlippedSecond: Rule,
    ruleBoth: Rule,
    ruleSafe: Rule
): void => {
    
    const rules = getParentRules(rule);
    const root = rules.shift();

    let rootRulesObject: RulesObject | undefined = store.rules.find(
        (rObject: RulesObject) => rObject.rule === root
    );
    if (!rootRulesObject) {
        const rootRuleFlipped = root.clone().removeAll();
        const rootRuleFlippedSecond = rootRuleFlipped.clone();
        const rootRuleBoth = rootRuleFlipped.clone();
        const rootRruleSafe = rootRuleFlipped.clone();
        rootRulesObject = insertRuleIntoStore(
            root,
            rootRuleFlipped,
            rootRuleFlippedSecond,
            rootRuleBoth,
            rootRruleSafe
        );
    }

    appendRulesToRuleObject(
        ruleFlipped,
        ruleFlippedSecond,
        ruleBoth,
        ruleSafe,
        rootRulesObject,
        rules
    );
    
};

export const cleanRuleRawsBefore = (node: Node | undefined, prefix = '\n\n'): void => {
    if (
        node &&
        (
            node.type === RULE_TYPE ||
            node.type === AT_RULE_TYPE
        )
    ) {
        node.raws.before = `${prefix}${
            node.raws.before
                ? node.raws.before.replace(/\n/g, '')
                : ''
        }`;
    }
};

export const cleanRules = (...rules: (Rule | AtRule)[]): void => {
    rules.forEach((rule: Rule | AtRule | undefined | null): void => {
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

export const removeEmptyRules = (rule: Container): void => {
    if (ruleHasChildren(rule)) {
        rule.walkRules((r: Rule): void => {
            removeEmptyRules(r);
            if (!ruleHasChildren(r)) {
                r.remove();
            }
        });
    } else {
        rule.remove();
    }
};

export const appendRules = (): void => {
    const { rules } = store;
    rules.forEach(({rule, ruleLTR, ruleRTL, ruleBoth, ruleSafe}): void => {
        if (ruleBoth.nodes.length) {
            rule.after(ruleBoth);
        }
        if (ruleRTL.nodes.length) {
            rule.after(ruleRTL);
        }
        if (ruleLTR.nodes.length) {
            rule.after(ruleLTR);
        }
        if (ruleSafe.nodes.length) {
            rule.after(ruleSafe);
        }
        removeEmptyRules(rule);
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

export const parseRuleNames = (): void => {

    if (!store.unmodifiedRules.length) {
        return;
    }

    const replaceHash: Record<string, string> = store.options.stringMap.reduce((hash: Record<string, string>, map: StringMap): Record<string, string> => {
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

    const rulesHash: Record<string, Rule> = {};
    const rulesToProcess: UnmodifiedRulesObject[] = [];

    store.unmodifiedRules.forEach((ruleObject: UnmodifiedRulesObject): void => {
        let process = false;
        ruleObject.rule.selectors.forEach((selector: string): void => {
            if (replaceRegExp.test(selector)) {
                rulesHash[selector] = ruleObject.rule.clone();
                process = true;
            }
            replaceRegExp.lastIndex = 0;
        });
        if (process) {
            rulesToProcess.push(ruleObject);
        } else if (store.options.mode === Mode.diff) {
            store.rulesToRemove.push(ruleObject.rule);
        }
    });

    rulesToProcess.forEach((ruleObject: UnmodifiedRulesObject): void => {

        const { rule, hasParentRule } = ruleObject;
        const ruleFlipped = rule.clone();
        const emptyRule = rule.clone().removeAll();
        let ruleFlippedSecond: Rule | undefined = undefined;

        for (const selector of rule.selectors) {
            const flip = selector.replace(replaceRegExp, (match: string, group: string): string => replaceHash[group]);
            if (rulesHash[flip]) {
                ruleFlippedSecond = rulesHash[flip].clone();
                break;
            }
        }

        if (ruleFlippedSecond) {

            ruleFlippedSecond.selectors = ruleFlipped.selectors;

            if (store.options.mode === Mode.combined) {

                if (hasParentRule) {

                    appendParentRuleToStore(
                        rule.removeAll(),
                        ruleFlipped,
                        ruleFlippedSecond,
                        emptyRule,
                        emptyRule
                    );
    
                } else {
    
                    insertRuleIntoStore(
                        rule.removeAll(),
                        ruleFlipped,
                        ruleFlippedSecond,
                        emptyRule,
                        emptyRule
                    );
    
                }

            } else {

                if (hasParentRule) {

                    appendParentRuleToStore(
                        store.options.mode === Mode.override
                            ? rule
                            : rule.removeAll(),
                        ruleFlippedSecond,
                        emptyRule,
                        emptyRule,
                        emptyRule
                    );

                } else {

                    insertRuleIntoStore(
                        store.options.mode === Mode.override
                            ? rule
                            : rule.removeAll(),
                        ruleFlippedSecond,
                        emptyRule,
                        emptyRule,
                        emptyRule
                    );

                }

            }

        }

        if (store.options.mode === Mode.diff) {
            store.rulesToRemove.push(rule);
        }

    });

};