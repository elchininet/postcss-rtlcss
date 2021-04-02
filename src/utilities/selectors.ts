import { Rule } from 'postcss';
import { strings, Mode, Source } from '@types';
import { store } from '@data/store';

export const addSelectorPrefixes = (rule: Rule, prefixes: strings): void => {
    rule.selectors = typeof prefixes === 'string'
        ? rule.selectors.map((selector: string): string => `${prefixes} ${selector}`)
        : rule.selectors.reduce((selectors: string[], selector: string): string[] => {
            selectors = selectors.concat(prefixes.map((prefix: string): string => `${prefix} ${selector}`));
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