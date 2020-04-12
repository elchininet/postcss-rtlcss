import postcss, { Rule, Declaration } from 'postcss';
import rtlcss from 'rtlcss';
import { RulesObject, PluginOptionsParsed, Source } from '@types';
import { DECLARATION_TYPE, COMMENT_TYPE } from '@constants';
import { addSelectorPrefixes } from '@utilities/selectors';

export const insertCombinedRules = (appends: RulesObject[], rule: Rule, options: PluginOptionsParsed): RulesObject[] => {

    const { ltrPrefix, rtlPrefix, source, processUrls, useCalc, stringMap } = options;

    const ruleStr = rule.toString();
    const ruleFlippedtring = rtlcss.process(ruleStr, {
        clean: false,
        processUrls,
        useCalc,
        stringMap
    });

    if (ruleStr === ruleFlippedtring) {
        return;
    }        
        
    const root = postcss.parse(ruleFlippedtring);
    const ruleFlipped = root.first as Rule;
    
    const deleteDeclarations: Declaration[] = [];
    const ruleFlippedSecond = ruleFlipped.clone();

    let index = 0;
    
    ruleFlipped.walk((nodeFlipped): void => {
        if (nodeFlipped.type === DECLARATION_TYPE) {
            const decl = rule.nodes[index] as Declaration;
            const declStr = decl.toString();
            const declFlippedStr = nodeFlipped.toString();
            const nodeFlippedSecond = ruleFlippedSecond.nodes[index] as Declaration;
            if (declStr === declFlippedStr) {
                deleteDeclarations.push(nodeFlipped);
                deleteDeclarations.push(nodeFlippedSecond);
            } else {
                nodeFlipped.replaceWith(decl.clone());
                deleteDeclarations.push(decl);
            }
        }
        index++;
    });

    deleteDeclarations.forEach((decl: Declaration): void => {
        const prev = decl.prev();
        if (prev && prev.type === COMMENT_TYPE) {
            prev.remove();
        }
        decl.remove();
    });

    addSelectorPrefixes(ruleFlipped, source === Source.ltr ? ltrPrefix : rtlPrefix);
    addSelectorPrefixes(ruleFlippedSecond, source === Source.rtl ? ltrPrefix : rtlPrefix);

    appends.push({
        rule,
        ruleLTR: ruleFlipped,
        ruleRTL: ruleFlippedSecond
    });

}; 