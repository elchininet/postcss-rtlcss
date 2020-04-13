import postcss, { Rule, Node, Declaration } from 'postcss';
import rtlcss from 'rtlcss';
import { RulesObject, PluginOptionsParsed, Source, Mode } from '@types';
import { DECLARATION_TYPE, FLIP_PROPERTY_REGEXP } from '@constants';
import { addSelectorPrefixes } from '@utilities/selectors';
import { walkContainer } from '@utilities/containers';

export const parseDeclarations = (rules: RulesObject[], rule: Rule, options: PluginOptionsParsed): void => {

    const { mode, ltrPrefix, rtlPrefix, source, processUrls, useCalc, stringMap } = options;

    const deleteDeclarations: Declaration[] = [];

    const ruleFlipped = rule.clone();
    const ruleFlippedSecond = rule.clone();

    ruleFlipped.removeAll();
    ruleFlippedSecond.removeAll();

    if (mode === Mode.combined) {
        addSelectorPrefixes(ruleFlipped, source === Source.ltr ? ltrPrefix : rtlPrefix);
        addSelectorPrefixes(ruleFlippedSecond, source === Source.rtl ? ltrPrefix : rtlPrefix);
    } else {
        addSelectorPrefixes(ruleFlipped, source === Source.ltr ? rtlPrefix : ltrPrefix);
    }

    walkContainer(rule, DECLARATION_TYPE, (node: Node): void => {
        
        const decl = node as Declaration;
        const declString = `${decl.toString()};`;
        const declFlippedString = rtlcss.process(declString, { processUrls, useCalc, stringMap });

        const root = postcss.parse(declFlippedString);
        const declFlipped = root.first as Declaration;
        declFlipped.raws = decl.raws;

        if (
            decl.prop.trim() === declFlipped.prop.trim() &&
            decl.value.trim() === declFlipped.value.trim()
        ) {
            return;
        }

        if (mode === Mode.combined) {
            const declClone = decl.clone();
            ruleFlipped.append(declClone);
            ruleFlippedSecond.append(declFlipped);
            deleteDeclarations.push(decl);
        } else {
            if (FLIP_PROPERTY_REGEXP.test(decl.prop)) {
                const declClone = decl.clone();
                declClone.value = 'unset';
                ruleFlipped.append(declClone);
            }
            ruleFlipped.append(declFlipped);
        }

    });

    if (deleteDeclarations.length) {
        deleteDeclarations.forEach((decl: Declaration): Declaration => decl.remove());
    }

    if (ruleFlipped.nodes.length || ruleFlippedSecond.nodes.length) {
        rules.push({
            rule,
            ruleLTR: ruleFlipped,
            ruleRTL: ruleFlippedSecond
        });
    }

}; 