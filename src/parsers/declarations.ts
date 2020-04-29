import postcss, { Rule, Node, Declaration, Comment, vendor } from 'postcss';
import rtlcss from 'rtlcss';
import { Source, Mode, Autorename, ObjectWithProps, ControlDirective } from '@types';
import {
    DECLARATION_TYPE,
    FLIP_PROPERTY_REGEXP,
    ANIMATION_PROP,
    ANIMATION_NAME_PROP,
    CONTROL_DIRECTIVE
} from '@constants';
import { store } from '@data/store';
import { addSelectorPrefixes } from '@utilities/selectors';
import { isIgnoreDirectiveInsideAnIgnoreBlock, checkDirective } from '@utilities/directives';
import { shorthands } from '@utilities/shorthands';
import { walkContainer } from '@utilities/containers';
import { cleanRuleRawsBefore } from '@utilities/rules';

export const parseDeclarations = (rule: Rule, autorenamed = false): void => {

    const {
        mode,
        ltrPrefix,
        rtlPrefix,
        bothPrefix,
        source,
        processUrls,
        useCalc,
        stringMap,
        autoRename,
        greedy
    } = store.options;

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
    let simetricRules = false;

    const controlDirectives: ObjectWithProps<ControlDirective> = {};
    
    walkContainer(
        rule,
        [ DECLARATION_TYPE ],
        (comment: Comment, controlDirective: ControlDirective) => {

            cleanRuleRawsBefore(comment.next());              
            comment.remove(); 

            if (isIgnoreDirectiveInsideAnIgnoreBlock(controlDirective, controlDirectives)) {
                return;
            }

            controlDirectives[controlDirective.directive] = controlDirective;

        },
        (node: Node): void => {

            if ( checkDirective(controlDirectives, CONTROL_DIRECTIVE.IGNORE) ) {
                return;
            }

            const processUrlDirective = checkDirective(controlDirectives, CONTROL_DIRECTIVE.RENAME);

            const decl = node as Declaration;
            const declString = `${decl.toString()};`;
            const declFlippedString = rtlcss.process(declString, {
                processUrls: processUrls || processUrlDirective,
                useCalc,
                stringMap,
                autoRename: autoRename !== Autorename.disabled,
                autoRenameStrict: autoRename === Autorename.strict,
                greedy
            });

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
                ? overridenBy.some((d: string): boolean => declarationsProps.indexOf(d) >= 0)
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
                            store.keyframes.length === 0 ||
                            !store.keyframesRegExp.test(declValue)
                        )
                    )
                )
            ) {
                return;
            }
            
            if (isAnimation) {

                const declValue = decl.value.replace(
                    store.keyframesRegExp,
                    (_match: string, before: string, animation: string, after: string): string =>
                        before + store.keyframesStringMap[animation].name + after
                );

                const declValueFlipped = decl.value.replace(
                    store.keyframesRegExp,
                    (_match: string, before: string, animation: string, after: string): string =>
                        before + store.keyframesStringMap[animation].nameFlipped + after
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
                    simetricRules = true;
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

        }
    );

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

        store.rules.push({
            rule,
            ruleLTR: ruleFlipped,
            ruleRTL: ruleFlippedSecond,
            ruleBoth
        });

    } else if (autoRename !== Autorename.disabled && !simetricRules && !autorenamed) {
        store.rulesAutoRename.push(rule);
    }

}; 