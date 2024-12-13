import {
    Container,
    Rule,
    Node,
    Declaration
} from 'postcss';
import {
    DeclarationContainer,
    RulesObject,
    UnmodifiedRulesObject,
    StringMap,
    Mode
} from '@types';
import { RTL_COMMENT_REGEXP } from '@constants';
import { store } from '@data/store';
import {
    isAtRule,
    isComment,
    isDeclaration,
    isDeclarationContainer,
    isRule,
    isString
} from '@utilities/predicates';
import { addProperSelectorPrefixes } from '@utilities/selectors';

export const containerHasDeclarations = (container: DeclarationContainer): boolean => {
    return container.some(
        (node: Node) => isDeclaration(node)
    );
};

export const ruleHasChildren = (rule: Container): boolean => {
    if (!rule.nodes) return false;
    return rule.some(
        (node: Node) => (
            isDeclaration(node) ||
            (
                isRule(node) &&
                ruleHasChildren(node)
            ) ||
            (
                isAtRule(node) &&
                ruleHasChildren(node)
            )
        )
    );
};

export const getParentContainers = (container: DeclarationContainer): DeclarationContainer[] => {
    const containers: DeclarationContainer[] = [];
    while (isDeclarationContainer(container)) {
        containers.unshift(container);
        container = container.parent as DeclarationContainer;
    }
    containers.pop();
    return containers;
};

export const insertRules = (
    parent: DeclarationContainer,
    container: DeclarationContainer,
    containers: DeclarationContainer[]
): void => {
    if (containerHasDeclarations(container)) {
        containers = [...containers];
        let parentContainer: DeclarationContainer;
        while (containers.length) {
            parentContainer = containers.shift();
            const innerRule = parent.nodes.find((node: Node): boolean => {
                if (
                    isRule(node)
                    && isRule(parentContainer)
                    && node.selector === parentContainer.selector
                ) {
                    return true;
                }
            }) as DeclarationContainer | undefined;
            if (innerRule) {
                parentContainer = innerRule;
            } else {
                parentContainer = parentContainer.clone().removeAll();
                parent.append(parentContainer);
            }
            parent = parentContainer;
        }
        parent.append(container);
    }
};

export const appendContainersToRuleObject = (
    containerFlipped: DeclarationContainer,
    containerFlippedSecond: DeclarationContainer,
    containerBoth: DeclarationContainer,
    containerSafe: DeclarationContainer,
    ruleObject: RulesObject,
    containers: DeclarationContainer[]
): void => {
    insertRules(
        ruleObject.ruleLTR,
        containerFlipped,
        containers
    );
    insertRules(
        ruleObject.ruleRTL,
        containerFlippedSecond,
        containers
    );
    insertRules(
        ruleObject.ruleBoth,
        containerBoth,
        containers
    );
    insertRules(
        ruleObject.ruleSafe,
        containerSafe,
        containers
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

export const appendParentContainerToStore = (
    container: DeclarationContainer,
    containerFlipped: DeclarationContainer,
    containerFlippedSecond: DeclarationContainer,
    containerBoth: DeclarationContainer,
    containerSafe: DeclarationContainer
): void => {
    
    const containers = getParentContainers(container);
    const root = containers.shift() as Rule;

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

    appendContainersToRuleObject(
        containerFlipped,
        containerFlippedSecond,
        containerBoth,
        containerSafe,
        rootRulesObject,
        containers
    );
    
};

export const cleanRuleRawsBefore = (node: Node | undefined, prefix = '\n\n'): void => {
    if (
        node &&
        (
            isRule(node) ||
            isAtRule(node)
        )
    ) {
        node.raws.before = `${prefix}${
            node.raws.before
                ? node.raws.before.replace(/\n/g, '')
                : ''
        }`;
    }
};

export const cleanRules = (...rules: DeclarationContainer[]): void => {
    rules.forEach((rule: DeclarationContainer | undefined | null): void => {
        const prev = rule.prev();
        if (prev && !isComment(prev)) {
            cleanRuleRawsBefore(rule);
        }
        rule.walk((node: Node): void => {
            if (isDeclaration(node)) {
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
    rules.forEach((ruleObject): void => {
        const {
            rule,
            ruleLTR,
            ruleRTL,
            ruleBoth,
            ruleSafe
        } = ruleObject;
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
        const search = isString(map.search)
            ? [map.search]
            : map.search;
        const replace = isString(map.replace)
            ? [map.replace]
            : map.replace;
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
            store.containersToRemove.push(ruleObject.rule);
        }
    });

    rulesToProcess.forEach((ruleObject: UnmodifiedRulesObject): void => {

        const { rule, hasParentRule } = ruleObject;
        const ruleFlipped = rule.clone();
        const emptyRule = rule.clone().removeAll();
        let ruleFlippedSecond: Rule | undefined = undefined;

        for (const selector of rule.selectors) {
            const flip = selector.replace(replaceRegExp, (__match: string, group: string): string => replaceHash[group]);
            if (rulesHash[flip]) {
                ruleFlippedSecond = rulesHash[flip].clone();
                break;
            }
        }

        if (ruleFlippedSecond) {

            ruleFlippedSecond.selectors = ruleFlipped.selectors;

            if (store.options.mode === Mode.combined) {

                if (hasParentRule) {

                    appendParentContainerToStore(
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

                    appendParentContainerToStore(
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
            store.containersToRemove.push(rule);
        }

    });

};

export const addToIgnoreRulesInDiffMode = (rule: Rule): void => {
    if (store.options.mode === Mode.diff) {
        store.containersToRemove.push(rule);
    }
};