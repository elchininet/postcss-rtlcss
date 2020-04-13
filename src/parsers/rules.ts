import { Root, Node, Rule } from 'postcss';
import { RulesObject, KeyFramesData, PluginOptionsNormalized } from '@types';
import { RULE_TYPE } from '@constants';
import { walkContainer } from '@utilities/containers';
import { parseDeclarations } from './declarations';

export const parseRules = (
    rules: RulesObject[],
    keyFramesData: KeyFramesData,
    css: Root,
    options: PluginOptionsNormalized
): void => {

    walkContainer(css, [ RULE_TYPE ], true, (node: Node): void => {
        const rule = node as Rule;
        parseDeclarations(rules, keyFramesData, rule, options);
    });    

}; 