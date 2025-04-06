import { Rule } from 'postcss';
import { strings, Mode, Source } from '@types';
import {
    HTML_SELECTOR_REGEXP,
    ROOT_SELECTOR_REGEXP,
    VIEW_TRANSITION_REGEXP
} from '@constants';
import { store } from '@data/store';
import { isString } from '@utilities/predicates';

const addPrefix = (prefix: string, selector: string): string => {
    if (store.options.prefixSelectorTransformer) {
        const transformedSelector = store.options.prefixSelectorTransformer(prefix, selector);
        if (transformedSelector && isString(transformedSelector)) {
            return transformedSelector;
        }
    }
    if (HTML_SELECTOR_REGEXP.test(selector)) {
        return selector.replace(HTML_SELECTOR_REGEXP, `$1${prefix}`);
    }
    if (ROOT_SELECTOR_REGEXP.test(selector)) {
        return selector.replace(ROOT_SELECTOR_REGEXP, `${prefix}$1`);
    }
    if (VIEW_TRANSITION_REGEXP.test(selector)) {
        return selector.replace(VIEW_TRANSITION_REGEXP, `${prefix}$1`);
    }
    return `${prefix} ${selector}`;
};

export const addSelectorPrefixes = (rule: Rule, prefixes: strings): void => {
    
    if (rule.selectors) {
        rule.selectors = isString(prefixes)
            ? rule.selectors.map((selector: string): string => {
                if (store.rulesPrefixRegExp.test(selector)) {
                    return selector;
                }
                return addPrefix(prefixes, selector);
            })
            : rule.selectors.reduce((selectors: string[], selector: string): string[] => {
                if (store.rulesPrefixRegExp.test(selector)) {
                    selectors = [...selectors, selector];
                } else {
                    selectors = selectors.concat(
                        prefixes.map((prefix: string): string => addPrefix(prefix, selector))
                    );
                }
                return selectors;
            }, []);
    }
};

export const hasSelectorsPrefixed = (rule: Rule): boolean => {
    const prefixed = rule.selectors.find((selector: string) => store.rulesPrefixRegExp.test(selector));
    return !!prefixed;
};

export const addProperSelectorPrefixes = (
    ruleFlipped: Rule,
    ruleFlippedSecond: Rule,
    ruleBoth: Rule,
    ruleSafe: Rule
): void => {
    const {
        mode,
        ltrPrefix,
        rtlPrefix,
        bothPrefix,
        source
    } = store.options;
    if (mode === Mode.combined) {
        addSelectorPrefixes(
            ruleFlipped,
            source === Source.ltr
                ? ltrPrefix
                : rtlPrefix
        );
        addSelectorPrefixes(
            ruleFlippedSecond,
            source === Source.ltr
                ? rtlPrefix
                : ltrPrefix
        );
    } else {
        addSelectorPrefixes(
            ruleFlipped,
            source === Source.ltr
                ? rtlPrefix
                : ltrPrefix
        );
        addSelectorPrefixes(
            ruleFlippedSecond,
            source === Source.ltr
                ? ltrPrefix
                : rtlPrefix
        );
    }
    addSelectorPrefixes(ruleBoth, bothPrefix);
    addSelectorPrefixes(ruleSafe, bothPrefix);
};