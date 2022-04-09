import postcss, {
    Rule,
    Node,
    Declaration,
    Comment
} from 'postcss';
import rtlcss from 'rtlcss';
import {
    Mode,
    Autorename,
    ControlDirective
} from '@types';
import {
    DECLARATION_TYPE,
    FLIP_PROPERTY_REGEXP,
    ANIMATION_PROP,
    ANIMATION_NAME_PROP,
    CONTROL_DIRECTIVE
} from '@constants';
import { store } from '@data/store';
import {
    isIgnoreDirectiveInsideAnIgnoreBlock,
    checkDirective,
    getSourceDirectiveValue
} from '@utilities/directives';
import {
    declarations,
    allDeclarations,
    initialValues,
    appendDeclarationToRule,
    hasIgnoreDirectiveInRaws,
    checkOverrides
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
    ruleSourceDirectiveValue: string,
    autorenamed = false
): void => {

    const {
        mode,
        source,
        safeBothPrefix,
        processUrls,
        processEnv,
        useCalc,
        stringMap,
        autoRename,
        greedy,
        aliases
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
            
            if (
                controlDirective.directive === CONTROL_DIRECTIVE.RAW &&
                controlDirective.option
            ) {
                const sourceDirectiveValue = getSourceDirectiveValue(
                    controlDirectives,
                    ruleSourceDirectiveValue
                );
                const root = postcss.parse(controlDirective.option);
                if (
                    (
                        mode === Mode.combined &&
                        !sourceDirectiveValue
                    ) ||
                    (
                        sourceDirectiveValue &&
                        (
                            (
                                mode === Mode.combined &&
                                sourceDirectiveValue === source
                            ) ||
                            (
                                mode === Mode.override &&
                                sourceDirectiveValue !== source
                            )
                        )
                    )
                ) {
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
                processEnv,
                useCalc,
                stringMap,
                autoRename: autoRename !== Autorename.disabled,
                autoRenameStrict: autoRename === Autorename.strict,
                greedy,
                aliases
            });

            const root = postcss.parse(declFlippedString);
            const declFlipped = root.first as Declaration;
            declFlipped.source = decl.source;
            declFlipped.raws = decl.raws;

            const declProp = decl.prop.trim();
            const declPropUnprefixed = vendor.unprefixed(declProp);
            const declValue = decl.value.trim();
            const isAnimation = declPropUnprefixed === ANIMATION_PROP || declPropUnprefixed === ANIMATION_NAME_PROP;
            const declFlippedProp = declFlipped.prop.trim();
            const declFlippedValue = declFlipped.value.trim();
            const overridenBy = declarations[declPropUnprefixed];
            const hasBeenOverriden = declarationsProps.includes(declPropUnprefixed) || (
                overridenBy
                    ? overridenBy.some((d: string): boolean => declarationsProps.indexOf(d) >= 0)
                    : false
            );
            const overridesPrevious = checkOverrides(declPropUnprefixed, declarationsProps);
            const isConflictedDeclaration = safeBothPrefix
                ? !!allDeclarations[declPropUnprefixed]
                : false;
            const sourceDirectiveValue = getSourceDirectiveValue(
                controlDirectives,
                ruleSourceDirectiveValue
            );
            const normalFlip =
                !sourceDirectiveValue ||
                sourceDirectiveValue === source ||
                mode === Mode.diff;
            
            if (
                declProp === declFlippedProp &&
                declValue === declFlippedValue &&
                !hasBeenOverriden &&
                !overridesPrevious &&
                !isConflictedDeclaration &&
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
                        if (mode === Mode.diff) {
                            appendDeclarationToRule(decl, ruleFlipped);
                        } else {
                            appendDeclarationToRule(decl, ruleSafe);
                        }
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
                        if (normalFlip) {
                            ruleFlipped.append(declClone);
                            ruleFlippedSecond.append(declCloneFlipped);
                        } else {
                            ruleFlipped.append(declCloneFlipped);
                            ruleFlippedSecond.append(declClone);
                        }
                        deleteDeclarations.push(decl);
                    } else {
                        decl.value = animationDeclValue;
                        declCloneFlipped.value = animationDeclValueFlipped;
                        if (normalFlip) {
                            ruleFlipped.append(declCloneFlipped);
                        } else {
                            ruleFlippedSecond.append(declCloneFlipped);
                        }
                        if (safeBothPrefix) {
                            if (mode === Mode.diff) {
                                appendDeclarationToRule(decl, ruleFlipped);
                            } else {
                                appendDeclarationToRule(decl, ruleSafe);
                            }
                            deleteDeclarations.push(decl);
                        }
                    }
                }

            } else {

                if (
                    declProp === declFlippedProp &&
                    declValue === declFlippedValue
                ) {
                    if (
                        (
                            hasBeenOverriden ||
                            isConflictedDeclaration ||
                            overridesPrevious
                        ) &&
                        !hasIgnoreDirectiveInRaws(decl)
                    ) {
                        if (mode === Mode.diff) {
                            appendDeclarationToRule(decl, ruleFlipped);
                        } else {
                            appendDeclarationToRule(
                                decl,
                                hasBeenOverriden || overridesPrevious
                                    ? ruleBoth
                                    : ruleSafe
                            );
                        }
                        deleteDeclarations.push(decl);
                    }
                    return;
                } else  if (declarationHashMap[declFlipped.prop] === declFlippedValue) {
                    simetricRules = true;
                    if (isConflictedDeclaration && !hasIgnoreDirectiveInRaws(decl)) {
                        if (mode === Mode.diff) {
                            appendDeclarationToRule(decl, ruleFlipped);
                        } else {
                            appendDeclarationToRule(decl, ruleSafe);
                        }
                        deleteDeclarations.push(decl);
                    }
                    return;
                }

                if (mode === Mode.combined) {
                    if (normalFlip) {
                        appendDeclarationToRule(decl, ruleFlipped);
                        ruleFlippedSecond.append(declFlipped);
                    } else {
                        appendDeclarationToRule(decl, ruleFlippedSecond);
                        ruleFlipped.append(declFlipped);
                    }
                    deleteDeclarations.push(decl);
                } else {
                    if (FLIP_PROPERTY_REGEXP.test(decl.prop) && !declarationHashMap[declFlipped.prop]) {
                        const declClone = decl.clone();
                        /* istanbul ignore next */
                        declClone.value = initialValues[decl.prop] || 'unset';
                        if (normalFlip) {
                            ruleFlipped.append(declClone);
                        } else {
                            ruleFlippedSecond.append(declClone);
                        }
                    }
                    if (
                        isConflictedDeclaration &&
                        !hasIgnoreDirectiveInRaws(decl) &&
                        mode !== Mode.diff
                    ) {
                        appendDeclarationToRule(decl, ruleSafe);
                        deleteDeclarations.push(decl);
                    }
                    if (normalFlip) {
                        ruleFlipped.append(declFlipped);
                    } else {
                        ruleFlippedSecond.append(declFlipped);
                    }
                                       
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
    } else if (
        mode === Mode.diff &&
        !autorenamed
    ) {
        store.rulesToRemove.push(rule);
    }

};