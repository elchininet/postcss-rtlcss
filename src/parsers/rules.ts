import { Root, Node, Rule } from 'postcss';
import { RulesObject, PluginOptionsParsed } from '@types';
import { RULE_TYPE } from '@constants';
import { walkContainer } from '@utilities/containers';
import { parseDeclarations } from './declarations';

export const parseRules = (rules: RulesObject[], css: Root, options: PluginOptionsParsed): void => {

    walkContainer(css, RULE_TYPE, (node: Node): void => {
        const rule = node as Rule;
        parseDeclarations(rules, rule, options);
    });

}; 