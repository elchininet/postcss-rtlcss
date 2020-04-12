import { Root, Node, Rule } from 'postcss';
import { RulesObject, PluginOptionsParsed, Mode } from '@types';
import { RULE_TYPE } from '@constants';
import { walkContainer } from '@utilities/containers';
import { insertCombinedRules } from './rules-combined';
import { insertOverrideRules } from './rules-override';

export const parseRules = (css: Root, options: PluginOptionsParsed): RulesObject[] => {
    
    const rules: RulesObject[] = [];

    walkContainer(css, RULE_TYPE, (node: Node) => {

        const rule = node as Rule;

        if (options.mode == Mode.combined) {
            insertCombinedRules(rules, rule, options);
        }
        if (options.mode === Mode.override) {
            insertOverrideRules(rules, rule, options);
        } 

    });

    return rules;

}; 