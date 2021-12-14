import postcss, { Rule } from 'postcss';
import { cleanRuleRawsBefore } from '../src/utilities/rules';

describe('Unit tests', (): void => {
    it('Test cleanRuleRawsBefore', (): void => {
        const css = `.test { color: red; }`;
        const root = postcss.parse(css);
        const rule = root.nodes[0] as Rule;
        const clone = rule.clone();
        clone.cleanRaws();
        cleanRuleRawsBefore(clone);
        root.append(clone);
        expect(root.toString()).toBe(`${css}\n\n${css}`);
    });
});