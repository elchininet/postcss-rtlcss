import postcss, {
    Rule,
    Node,
    Declaration,
    Comment
} from 'postcss';
import rtlcss from 'rtlcss';
import {
    ControlDirective,
    DeclarationContainer,
    DeclarationHashMap,
    Mode
} from '@types';
import {
    TYPE,
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
    checkOverrides,
    hasMirrorDeclaration,
    hasSameUpcomingDeclarationWithoutMirror
} from '@utilities/declarations';
import { isDeclaration, isRule } from '@utilities/predicates';
import { walkContainer } from '@utilities/containers';
import {
    cleanRuleRawsBefore,
    insertRuleIntoStore,
    appendParentContainerToStore
} from '@utilities/rules';
import { vendor } from '@utilities/vendor';

export const parseDeclarations = (
    container: DeclarationContainer,
    hasParentRule: boolean,
    ruleSourceDirectiveValue: string,
    ruleFreezeDirectiveActive: boolean,
    processRule: boolean,
    rename: boolean
): void => {

    const {
        mode,
        source,
        safeBothPrefix,
        processUrls,
        processRuleNames,
        processEnv,
        useCalc,
        stringMap,
        greedy,
        aliases,
        plugins
    } = store.options;

    const deleteDeclarations: Declaration[] = [];
    const containerFlipped = container.clone().removeAll();
    const containerFlippedSecond = containerFlipped.clone();
    const containerBoth = containerFlipped.clone();
    const containerSafe = containerFlipped.clone();

    const declarationHashMap = Array.prototype.reduce.call(container.nodes, (obj: DeclarationHashMap, node: Node): DeclarationHashMap => {
        if (isDeclaration(node)) {
            const index = container.index(node);
            obj[node.prop] = obj[node.prop] || { ignore: false, indexes: {} };
            obj[node.prop].indexes[index] = {
                decl: node,
                value: node.value.trim(),
                ignore: false
            };
        }
        return obj;
    }, {});

    const declarationsProps: string[] = [];
    const controlDirectives: Record<string, ControlDirective> = {};
    let simetricRules = false;
    
    walkContainer(
        container,
        [ TYPE.DECLARATION ],
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
                /* the source could be undefined in certain cases but not during the tests */
                /* istanbul ignore next */
                const root = postcss.parse(
                    controlDirective.option,
                    {
                        from: container.source?.input?.from
                    }
                );
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
                    containerFlippedSecond.append(root.nodes);
                } else {
                    containerFlipped.append(root.nodes);
                }
                
            }

            if (isIgnoreDirectiveInsideAnIgnoreBlock(controlDirective, controlDirectives)) {
                return;
            }

            controlDirectives[controlDirective.directive] = controlDirective;

        },
        (decl: Declaration): void => {

            if ( checkDirective(controlDirectives, CONTROL_DIRECTIVE.IGNORE) ) {
                return;
            }

            const isProcessUrlDirectiveActive = checkDirective(controlDirectives, CONTROL_DIRECTIVE.URLS);

            const declString = `${decl.toString()};`;
            const declFlippedString = rtlcss.process(declString, {
                processUrls: processUrls || isProcessUrlDirectiveActive || rename,
                processEnv,
                useCalc,
                stringMap,
                greedy,
                aliases
            }, plugins);

            /* the source could be undefined in certain cases but not during the tests */
            /* istanbul ignore next */
            const root = postcss.parse(
                declFlippedString,
                {
                    from: container.source?.input?.from
                }
            );
            const declFlipped = root.first as Declaration;
            declFlipped.source = decl.source;
            declFlipped.raws = decl.raws;

            const declProp = decl.prop;
            const declPropUnprefixed = vendor.unprefixed(declProp);
            const declValue = decl.value.trim();
            const declIndexes = Object.keys(declarationHashMap[declProp].indexes).map(Number);
            const isAnimation = (
                declPropUnprefixed === ANIMATION_PROP ||
                declPropUnprefixed === ANIMATION_NAME_PROP ||
                aliases[declPropUnprefixed] === ANIMATION_PROP ||
                aliases[declPropUnprefixed] === ANIMATION_NAME_PROP
            );
            const declFlippedProp = declFlipped.prop.trim();
            const declFlippedValue = declFlipped.value.trim();
            const overridenBy = aliases[declPropUnprefixed]
                ? declarations[aliases[declPropUnprefixed]]
                : declarations[declPropUnprefixed];
            const hasBeenOverriden = (
                declarationsProps.includes(declPropUnprefixed) ||
                declarationsProps.includes(aliases[declPropUnprefixed]) ||
                (
                    overridenBy
                        ? overridenBy.some((d: string): boolean => declarationsProps.indexOf(d) >= 0)
                        : false
                )
            );
            const overridesPrevious = aliases[declPropUnprefixed]
                ? checkOverrides(aliases[declPropUnprefixed], declarationsProps)
                : checkOverrides(declPropUnprefixed, declarationsProps);
            const isConflictedDeclaration = safeBothPrefix
                ? aliases[declPropUnprefixed]
                    ? !!(allDeclarations[aliases[declPropUnprefixed]])
                    : !!(allDeclarations[declPropUnprefixed])
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
                checkDirective(controlDirectives, CONTROL_DIRECTIVE.FREEZE) ||
                ruleFreezeDirectiveActive
            ) {
                if (mode === Mode.combined) {
                    appendDeclarationToRule(decl, containerFlipped);
                    declarationsProps.push(declPropUnprefixed);
                    deleteDeclarations.push(decl);
                }
                return;
            }
            
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

            if (
                (
                    declarationHashMap[decl.prop].ignore &&
                    !isConflictedDeclaration
                ) ||
                hasSameUpcomingDeclarationWithoutMirror(container, decl, declFlipped, declarationHashMap)
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
                            appendDeclarationToRule(decl, containerFlipped);
                        } else {
                            appendDeclarationToRule(decl, containerSafe);
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
                            containerFlipped.append(declClone);
                            containerFlippedSecond.append(declCloneFlipped);
                        } else {
                            containerFlipped.append(declCloneFlipped);
                            containerFlippedSecond.append(declClone);
                        }
                        deleteDeclarations.push(decl);
                    } else {
                        decl.value = animationDeclValue;
                        declCloneFlipped.value = animationDeclValueFlipped;
                        if (normalFlip) {
                            containerFlipped.append(declCloneFlipped);
                        } else {
                            containerFlippedSecond.append(declCloneFlipped);
                        }
                        if (safeBothPrefix && mode !== Mode.diff) {
                            appendDeclarationToRule(decl, containerSafe);
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
                            appendDeclarationToRule(decl, containerFlipped);
                        } else {
                            appendDeclarationToRule(
                                decl,
                                hasBeenOverriden || overridesPrevious
                                    ? containerBoth
                                    : containerSafe
                            );
                        }
                        deleteDeclarations.push(decl);
                    }
                    return;
                } else  if (hasMirrorDeclaration(container, declFlipped, declarationHashMap)) {
                    simetricRules = true;
                    if (isConflictedDeclaration && !hasIgnoreDirectiveInRaws(decl)) {
                        if (mode === Mode.diff) {
                            appendDeclarationToRule(decl, containerFlipped);
                        } else {
                            appendDeclarationToRule(decl, containerSafe);
                        }
                        deleteDeclarations.push(decl);
                    }
                    return;
                }

                if (mode === Mode.combined) {
                    if (normalFlip) {
                        appendDeclarationToRule(decl, containerFlipped);
                        containerFlippedSecond.append(declFlipped);
                    } else {
                        appendDeclarationToRule(decl, containerFlippedSecond);
                        containerFlipped.append(declFlipped);
                    }
                    deleteDeclarations.push(decl);
                } else {
                    if (
                        FLIP_PROPERTY_REGEXP.test(decl.prop) &&
                        !declarationHashMap[declFlipped.prop] &&
                        container.index(decl) === declIndexes[0]
                    ) {
                        const declClone = decl.clone();
                        /* If for some reason the initial value is not covered in the code it should be unset */
                        /* During the tests all the initial values are covered */
                        /* istanbul ignore next */
                        declClone.value = initialValues[decl.prop] || 'unset';
                        if (normalFlip) {
                            containerFlipped.append(declClone);
                        } else {
                            containerFlippedSecond.append(declClone);
                        }
                    }
                    if (
                        isConflictedDeclaration &&
                        !hasIgnoreDirectiveInRaws(decl) &&
                        mode !== Mode.diff
                    ) {
                        appendDeclarationToRule(decl, containerSafe);
                        deleteDeclarations.push(decl);
                    }
                    if (normalFlip) {
                        containerFlipped.append(declFlipped);
                    } else {
                        containerFlippedSecond.append(declFlipped);
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
        containerFlipped.nodes.length ||
        containerFlippedSecond.nodes.length ||
        containerBoth.nodes.length ||
        containerSafe.nodes.length
    ) {
        if (hasParentRule) {
            appendParentContainerToStore(
                container,
                containerFlipped,
                containerFlippedSecond,
                containerBoth,
                containerSafe
            );
        } else {
            insertRuleIntoStore(
                container as Rule,
                containerFlipped as Rule,
                containerFlippedSecond as Rule,
                containerBoth as Rule,
                containerSafe as Rule
            );
        }
    } else if (
        isRule(container)
        && (
            processRuleNames ||
            processRule
        )
        && !simetricRules
    ) {
        store.unmodifiedRules.push({
            rule: container,
            hasParentRule
        });
    } else if (mode === Mode.diff) {
        store.containersToRemove.push(container);
    }

};