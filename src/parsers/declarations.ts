import postcss, { Rule, Node, Declaration, vendor } from 'postcss';
import rtlcss from 'rtlcss';
import { RulesObject, KeyFramesData, PluginOptionsNormalized, Source, Mode } from '@types';
import { DECLARATION_TYPE, FLIP_PROPERTY_REGEXP, ANIMATION_PROP, ANIMATION_NAME_PROP } from '@constants';
import { addSelectorPrefixes } from '@utilities/selectors';
import { walkContainer } from '@utilities/containers';

export const parseDeclarations = (
    rules: RulesObject[],
    keyFrameData: KeyFramesData,
    rule: Rule,
    options: PluginOptionsNormalized
): void => {

    const { mode, ltrPrefix, rtlPrefix, source, processUrls, useCalc, stringMap } = options;

    const deleteDeclarations: Declaration[] = [];

    const ruleFlipped = rule.clone();
    const ruleFlippedSecond = rule.clone();

    ruleFlipped.removeAll();
    ruleFlippedSecond.removeAll();

    walkContainer(rule, [ DECLARATION_TYPE ], true, (node: Node): void => {
        
        const decl = node as Declaration;
        const declString = `${decl.toString()};`;
        const declFlippedString = rtlcss.process(declString, { processUrls, useCalc, stringMap });

        const root = postcss.parse(declFlippedString);
        const declFlipped = root.first as Declaration;
        declFlipped.raws = decl.raws;

        const declProp = decl.prop.trim();
        const declPropUnprefixed = vendor.unprefixed(declProp);
        const declValue = decl.value.trim();
        const isAnimation = declPropUnprefixed === ANIMATION_PROP || declPropUnprefixed === ANIMATION_NAME_PROP;
        
        if (
            declProp === declFlipped.prop.trim() &&
            declValue === declFlipped.value.trim() &&
            (
                !isAnimation ||
                (
                    isAnimation &&
                    (
                        keyFrameData.length === 0 ||
                        !keyFrameData.regExp.test(declValue)
                    )
                )
            )
        ) {
            return;
        }

        if (isAnimation) {

            const animationNames = decl.value.match(keyFrameData.regExp);
            const animationName = animationNames[0].trim();
            const declValue = decl.value.replace(animationName, keyFrameData.stringMap[animationName].name);
            const declValueFlipped = decl.value.replace(animationName, keyFrameData.stringMap[animationName].nameFlipped);

            const declCloneFlipped = decl.clone();

            if (mode === Mode.combined) {
                const declClone = decl.clone();
                declClone.value = declValue;
                declCloneFlipped.value = declValueFlipped;
                ruleFlipped.append(declClone);
                ruleFlippedSecond.append(declCloneFlipped);
                deleteDeclarations.push(decl);
            } else {
                const declCloneFlipped = decl.clone(); 
                decl.value = declValue;                               
                declCloneFlipped.value = declValueFlipped;
                ruleFlipped.append(declCloneFlipped);                
            }
        } else {

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

        }

    });

    if (deleteDeclarations.length) {
        deleteDeclarations.forEach((decl: Declaration): Declaration => decl.remove());
    }

    if (ruleFlipped.nodes.length || ruleFlippedSecond.nodes.length) {

        if (mode === Mode.combined) {
            addSelectorPrefixes(ruleFlipped, source === Source.ltr ? ltrPrefix : rtlPrefix);
            addSelectorPrefixes(ruleFlippedSecond, source === Source.rtl ? ltrPrefix : rtlPrefix);
        } else {
            addSelectorPrefixes(ruleFlipped, source === Source.ltr ? rtlPrefix : ltrPrefix);
            addSelectorPrefixes(ruleFlippedSecond, source === Source.rtl ? rtlPrefix : ltrPrefix);
        }

        rules.push({
            rule,
            ruleLTR: ruleFlipped,
            ruleRTL: ruleFlippedSecond
        });
    }

}; 