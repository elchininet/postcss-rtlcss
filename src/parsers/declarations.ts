import postcss, { Rule, Node, Declaration, Comment } from 'postcss';
import rtlcss from 'rtlcss';
import { Mode, Autorename, ControlDirective } from '@types';
import {
    DECLARATION_TYPE,
    FLIP_PROPERTY_REGEXP,
    ANIMATION_PROP,
    ANIMATION_NAME_PROP,
    CONTROL_DIRECTIVE
} from '@constants';
import { store } from '@data/store';
import { isIgnoreDirectiveInsideAnIgnoreBlock, checkDirective } from '@utilities/directives';
import {
    declarations,
    allDeclarations,
    initialValues,
    appendDeclarationToRule,
    hasIgnoreDirectiveInRaws
} from '@utilities/declarations';
import { walkContainer } from '@utilities/containers';
import {
    cleanRuleRawsBefore,
    insertRuleIntoStore,
    appendParentRuleToStore
} from '@utilities/rules';
import { vendor } from '@utilities/vendor';

export const parseDeclarations = (
    rule: Rule,
    hasParentRule: boolean,
    autorenamed = false
): void => {

    const {
        mode,
        safeBothPrefix,
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
    const ruleSafe = ruleFlipped.clone();   

    const declarationHashMap = Array.prototype.reduce.call(rule.nodes, (obj: Record<string, string>, node: Node): Record<string, string> => {
        if (node.type === DECLARATION_TYPE) {
            const decl = node as Declaration;
            obj[decl.prop] = decl.value.trim();
        }
        return obj;
    }, {});

    const declarationsProps: string[] = [];
    let simetricRules = false;

    const controlDirectives: Record<string, ControlDirective> = {};
    
    walkContainer(
        rule,
        [ DECLARATION_TYPE ],
        (comment: Comment, controlDirective: ControlDirective) => {

            cleanRuleRawsBefore(comment.next());              
            comment.remove(); 

            if (controlDirective.directive === CONTROL_DIRECTIVE.RAW && controlDirective.raw) {
                const root = postcss.parse(controlDirective.raw);
                if (mode === Mode.combined) {
                    ruleFlippedSecond.append(root.nodes);
                } else {
                    ruleFlipped.append(root.nodes);
                }
                
            }

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
            const overridenBy = declarations[declPropUnprefixed];
            const hasBeenOverriden = overridenBy
                ? overridenBy.some((d: string): boolean => declarationsProps.indexOf(d) >= 0)
                : false;
            const isConflictedDeclaration = safeBothPrefix
                ? !!allDeclarations[declPropUnprefixed]
                : false;
            
            if (
                !hasBeenOverriden &&
                !isConflictedDeclaration &&
                declProp === declFlippedProp &&
                declValue === declFlippedValue &&
                !isAnimation
            ) {
                return;
            }
            
            if (isAnimation) {

                if(
                    declProp === declFlippedProp &&
                    declValue === declFlippedValue &&
                    (
                        store.keyframes.length === 0 ||
                        !store.keyframesRegExp.test(declValue)
                    )
                ) {

                    if (safeBothPrefix && !hasIgnoreDirectiveInRaws(decl)) {
                        appendDeclarationToRule(decl, ruleSafe);
                        deleteDeclarations.push(decl);
                    }                    

                } else {
                    const animationDeclValue = decl.value.replace(
                        store.keyframesRegExp,
                        (_match: string, before: string, animation: string, after: string): string =>
                            before + store.keyframesStringMap[animation].name + after
                    );
    
                    const animationDeclValueFlipped = decl.value.replace(
                        store.keyframesRegExp,
                        (_match: string, before: string, animation: string, after: string): string =>
                            before + store.keyframesStringMap[animation].nameFlipped + after
                    );
    
                    const declCloneFlipped = decl.clone();
    
                    if (mode === Mode.combined) {
                        const declClone = decl.clone();
                        declClone.value = animationDeclValue;
                        declCloneFlipped.value = animationDeclValueFlipped;
                        ruleFlipped.append(declClone);
                        ruleFlippedSecond.append(declCloneFlipped);
                        deleteDeclarations.push(decl);
                    } else {
                        const declCloneFlipped = decl.clone(); 
                        decl.value = animationDeclValue;                            
                        declCloneFlipped.value = animationDeclValueFlipped;
                        ruleFlipped.append(declCloneFlipped);
                        if (safeBothPrefix) {
                            appendDeclarationToRule(decl, ruleSafe);                       
                            deleteDeclarations.push(decl);
                        }
                    }
                }

            } else {

                if (
                    declProp === declFlippedProp &&
                    declValue === declFlippedValue                    
                ) {
                    if ((hasBeenOverriden || isConflictedDeclaration) && !hasIgnoreDirectiveInRaws(decl)) {
                        appendDeclarationToRule(decl, hasBeenOverriden ? ruleBoth : ruleSafe);                       
                        deleteDeclarations.push(decl);
                    }
                    return;                   
                } else  if (declarationHashMap[declFlipped.prop] === declFlippedValue) {
                    simetricRules = true;
                    if (isConflictedDeclaration && !hasIgnoreDirectiveInRaws(decl)) {
                        appendDeclarationToRule(decl, ruleSafe);                       
                        deleteDeclarations.push(decl);
                    }
                    return;
                }

                if (mode === Mode.combined) {
                    appendDeclarationToRule(decl, ruleFlipped);
                    ruleFlippedSecond.append(declFlipped);
                    deleteDeclarations.push(decl);
                } else {
                    if (FLIP_PROPERTY_REGEXP.test(decl.prop) && !declarationHashMap[declFlipped.prop]) {
                        const declClone = decl.clone();
                        /* istanbul ignore next */
                        declClone.value = initialValues[decl.prop] || 'unset';
                        ruleFlipped.append(declClone);
                    }
                    if (isConflictedDeclaration && !hasIgnoreDirectiveInRaws(decl)) {
                        appendDeclarationToRule(decl, ruleSafe);
                        deleteDeclarations.push(decl);
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

    if (
        ruleFlipped.nodes.length ||
        ruleFlippedSecond.nodes.length ||
        ruleBoth.nodes.length ||
        ruleSafe.nodes.length
    ) {

        if (hasParentRule) {            
            appendParentRuleToStore(
                rule,
                ruleFlipped,
                ruleFlippedSecond,
                ruleBoth,
                ruleSafe
            );
        } else {
            insertRuleIntoStore(
                rule,
                ruleFlipped,
                ruleFlippedSecond,
                ruleBoth,
                ruleSafe
            );
        }

    } else if (
        autoRename !== Autorename.disabled &&
        !simetricRules &&
        !autorenamed
    ) {
        store.rulesAutoRename.push(rule);
    }

}; 