import { Rule } from 'postcss';
import { strings, Mode, Source } from '@types';
import { HTML_SELECTOR_REGEXP, ROOT_SELECTOR_REGEXP } from '@constants';
import { store } from '@data/store';

const addPrefix = (prefix: string, selector: string): string => {
    if (HTML_SELECTOR_REGEXP.test(selector)) {
        return selector.replace(HTML_SELECTOR_REGEXP, `$1${prefix}`);
    }
    if (ROOT_SELECTOR_REGEXP.test(selector)) {
        return selector.replace(ROOT_SELECTOR_REGEXP, `${prefix}$1`);
    }
    return `${prefix} ${selector}`;
};

export const addSelectorPrefixes = (rule: Rule, prefixes: strings): void => {
    rule.selectors = typeof prefixes === 'string'
        ? rule.selectors.map((selector: string): string => addPrefix(prefixes, selector))
        : rule.selectors.reduce((selectors: string[], selector: string): string[] => {
            selectors = selectors.concat(prefixes.map((prefix: string): string => addPrefix(prefix, selector)));
            return selectors;
        }, []);
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
        addSelectorPrefixes(ruleFlipped, source === Source.ltr ? ltrPrefix : rtlPrefix);
        addSelectorPrefixes(ruleFlippedSecond, source === Source.rtl ? ltrPrefix : rtlPrefix);
    } else {
        addSelectorPrefixes(ruleFlipped, source === Source.ltr ? rtlPrefix : ltrPrefix);
        addSelectorPrefixes(ruleFlippedSecond, source === Source.rtl ? rtlPrefix : ltrPrefix);
    }

    addSelectorPrefixes(ruleBoth, bothPrefix);
    addSelectorPrefixes(ruleSafe, bothPrefix);
};