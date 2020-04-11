import { Rule } from 'postcss';
import { strings } from '@types';

export const addSelectorPrefixes = (rule: Rule, prefixes: strings): void => {
    rule.selectors = typeof prefixes === 'string'
        ? rule.selectors.map((selector: string): string => `${prefixes} ${selector}`)
        : rule.selectors.reduce((selectors: string[], selector: string): string[] => {
            selectors = selectors.concat(prefixes.map((prefix: string): string => `${prefix} ${selector}`));
            return selectors;
        }, []);
};