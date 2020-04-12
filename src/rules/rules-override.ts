import postcss, { Rule, Declaration } from 'postcss';
import rtlcss from 'rtlcss';
import { RulesObject, PluginOptionsParsed, Source } from '@types';
import { DECLARATION_TYPE, FLIP_PROPERTY_REGEXP, COMMENT_TYPE } from '@constants';
import { addSelectorPrefixes } from '@utilities/selectors';
import { getRTLCSSStringMap } from '@utilities/options';

export const insertOverrideRules = (appends: RulesObject[], rule: Rule, options: PluginOptionsParsed): void => {

    const { ltrPrefix, rtlPrefix, source, processUrls, useCalc, stringMap } = options;
    const prefixes = source === Source.ltr ? rtlPrefix : ltrPrefix;
    
    const ruleStr = rule.toString();
    const ruleFlippedtring = rtlcss.process(ruleStr, {
        clean: false,
        processUrls,
        useCalc,
        stringMap: getRTLCSSStringMap(stringMap)
    });

    if (ruleStr === ruleFlippedtring) {
        return;
    }        
        
    const root = postcss.parse(ruleFlippedtring);
    const ruleFlipped = root.first as Rule;

    let index = 0;
    
    ruleFlipped.walk((nodeFlipped): void => {
        if (nodeFlipped.type === DECLARATION_TYPE) {
            const decl = rule.nodes[index] as Declaration;
            const declStr = decl.toString();
            const declFlippedStr = nodeFlipped.toString();            
            if (declStr === declFlippedStr) {
                const prev = nodeFlipped.prev();
                if (prev && prev.type === COMMENT_TYPE) {
                    prev.remove();
                }
                nodeFlipped.remove();
            } else if (FLIP_PROPERTY_REGEXP.test(decl.prop.toString())) {
                const declClone = decl.clone();
                declClone.value = 'unset';
                nodeFlipped.before(declClone);
            }
        }
        index++;
    });
        
    addSelectorPrefixes(ruleFlipped, prefixes);

    appends.push({
        rule,
        ruleLTR: source === Source.ltr ? null : ruleFlipped,
        ruleRTL: source === Source.rtl ? null : ruleFlipped
    });

}; 