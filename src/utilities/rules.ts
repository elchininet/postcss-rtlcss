import { Rule } from 'postcss';

export const parseRule = (rule: Rule): void => {
    // @ts-ignore
    rule.cleanRaws();
    if (rule.root().index(rule) > 0) {
        rule.raws.before = '\n\n';
    }
};