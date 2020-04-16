import postcss, { Rule, Node, Declaration, vendor } from 'postcss';
import rtlcss from 'rtlcss';
import { RulesObject, KeyFramesData, PluginOptionsNormalized, Source, Mode, ObjectWithProps } from '@types';
import { DECLARATION_TYPE, FLIP_PROPERTY_REGEXP, ANIMATION_PROP, ANIMATION_NAME_PROP } from '@constants';
import { addSelectorPrefixes } from '@utilities/selectors';
import { shorthands } from '@utilities/shorthands';
import { walkContainer } from '@utilities/containers';

export const parseDeclarations = (
    rules: RulesObject[],
    keyFrameData: KeyFramesData,
    rule: Rule,
    options: PluginOptionsNormalized
): void => {

    const { mode, ltrPrefix, rtlPrefix, bothPrefix, source, processUrls, useCalc, stringMap } = options;

    const deleteDeclarations: Declaration[] = [];

    const ruleFlipped = rule.clone().removeAll();
    const ruleFlippedSecond = ruleFlipped.clone();
    const ruleBoth = ruleFlipped.clone();

    const declarationHashMap = Array.prototype.reduce.call(rule.nodes, (obj: ObjectWithProps<string>, node: Node): object => {
        if (node.type === DECLARATION_TYPE) {
            const decl = node as Declaration;
            obj[decl.prop] = decl.value.trim();
        }
        return obj;
    }, {});

    const declarationsProps: string[] = [];

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
        const declFlippedProp = declFlipped.prop.trim();
        const declFlippedValue = declFlipped.value.trim();
        const overridenBy = shorthands[declPropUnprefixed];
        const hasBeenOverriden = overridenBy
            ? declarationsProps.some((d: string): boolean => overridenBy.indexOf(d) >= 0)
            : false;
        
        if (
            !hasBeenOverriden &&
            declProp === declFlippedProp &&
            declValue === declFlippedValue &&
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

            const declValue = decl.value.replace(
                keyFrameData.regExp,
                (_match: string, before: string, animation: string, after: string): string =>
                    before + keyFrameData.stringMap[animation].name + after
            );

            const declValueFlipped = decl.value.replace(
                keyFrameData.regExp,
                (_match: string, before: string, animation: string, after: string): string =>
                    before + keyFrameData.stringMap[animation].nameFlipped + after
            );

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

            if (
                hasBeenOverriden &&
                declProp === declFlippedProp &&
                declValue === declFlippedValue
            ) {
                const declClone = decl.clone();
                ruleBoth.append(declClone);
                deleteDeclarations.push(decl);
                return;
            } else  if (declarationHashMap[declFlipped.prop] === declFlippedValue) {
                return;
            }

            if (mode === Mode.combined) {
                const declClone = decl.clone();
                ruleFlipped.append(declClone);
                ruleFlippedSecond.append(declFlipped);
                deleteDeclarations.push(decl);
            } else {
                if (FLIP_PROPERTY_REGEXP.test(decl.prop) && !declarationHashMap[declFlipped.prop]) {
                    const declClone = decl.clone();
                    declClone.value = 'unset';
                    ruleFlipped.append(declClone);
                }
                ruleFlipped.append(declFlipped);
            }

            declarationsProps.push(declPropUnprefixed);

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

        addSelectorPrefixes(ruleBoth, bothPrefix);

        rules.push({
            rule,
            ruleLTR: ruleFlipped,
            ruleRTL: ruleFlippedSecond,
            ruleBoth
        });
    }

}; 