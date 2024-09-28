import { Declaration } from 'postcss';
import {
    DeclarationContainer,
    DeclarationsData,
    DeclarationHashMap
} from '@types';
import { RTL_COMMENT_IGNORE_REGEXP, FLIP_PROPERTY_REGEXP } from '@constants';
import { isComment } from '@utilities/predicates';
import shorthandDeclarationsJson from '@data/shorthand-declarations.json';
import logicalDeclarationsJson from '@data/logical-declarations.json';
import notShorthandDeclarationsJson from '@data/not-shorthand-declarations.json';
import initialValuesJson from '@data/initial-values.json';

const declarationsData: DeclarationsData = shorthandDeclarationsJson;
const logicalDeclarationsData: DeclarationsData = logicalDeclarationsJson;
const notShorthandDeclarationsArray: string[] = notShorthandDeclarationsJson;
const initialValuesData: Record<string, string[]> = initialValuesJson;
const declarations: Record<string, string[]> = {};
const allDeclarations: Record<string, string[]> = {};
const initialValues: Record<string, string> = {};

const getUniqueArray = (array: string[]): string[] => Array.from(new Set(array));

const getOverrideTree = (prop: string): string[] => {
    const overridenProp = declarationsData[prop].overridden;
    const overridden = overridenProp
        ? [overridenProp].concat(getOverrideTree(overridenProp))
        : [];
    return overridden;
};

const getOverrideLogicalTree = (prop: string): string[] => {
    const overridenProp = declarationsData[prop]?.overridden;
    const logicalOverridenProp = logicalDeclarationsData[prop].overridden;
    const overridden = overridenProp
        ? [overridenProp].concat(getOverrideTree(overridenProp))
        : [];
    const logicalOverriden = logicalOverridenProp
        ? [logicalOverridenProp].concat(getOverrideTree(logicalOverridenProp))
        : [];
    return getUniqueArray(
        [ ...overridden, ...logicalOverriden ]
    );
};

Object.keys(declarationsData).forEach((prop: string): void => {
    const overrideTree =  getOverrideTree(prop);
    declarations[prop] = overrideTree;
    declarationsData[prop].overrides.forEach((oprop: string): void => {
        declarations[oprop] = [prop].concat(overrideTree);
    });
});

Object.keys(logicalDeclarationsData).forEach((prop: string): void => {
    const overrideLogicalTree =  getOverrideLogicalTree(prop);
    declarations[prop] = declarations[prop]
        ? getUniqueArray([...declarations[prop], ...overrideLogicalTree])
        : overrideLogicalTree;
    logicalDeclarationsData[prop].overrides.forEach((oprop: string): void => {
        declarations[oprop] = declarations[oprop]
            ? getUniqueArray([ ...declarations[oprop], ...[prop].concat(overrideLogicalTree) ])
            : getUniqueArray([prop].concat(overrideLogicalTree));
    });
});

Object.assign(allDeclarations, declarations);

notShorthandDeclarationsArray.forEach((declaration: string): void => {
    allDeclarations[declaration] = [];
});

Object.keys(initialValuesData).forEach((value: string): void => {
    initialValuesData[value].forEach((prop: string): void => {
        initialValues[prop] = value;
    });
});

const appendDeclarationToRule = (decl: Declaration, container: DeclarationContainer): void => {
    const declClone = decl.clone();
    const declPrev = decl.prev();
    if (declPrev && isComment(declPrev)) {
        const commentClone = declPrev.clone();
        container.append(commentClone);
        declPrev.remove();
    }
    container.append(declClone);
};

const hasIgnoreDirectiveInRaws = (decl: Declaration): boolean => {
    const raws = !!decl.raws && !!decl.raws.value && decl.raws.value.raw;
    if (raws && RTL_COMMENT_IGNORE_REGEXP.test(raws)) {
        return true;
    }
    return false;
};

const checkOverrides = (decl: string, decls: string[]): boolean => {
    return decls.some((d: string): boolean => declarations[d] && declarations[d].includes(decl));
};

const hasSameUpcomingDeclarationWithoutMirror = (
    container: DeclarationContainer,
    decl: Declaration,
    declFlipped: Declaration,
    declarationHashMap: DeclarationHashMap
): boolean => {
    const index = container.index(decl);
    const hashMapData = declarationHashMap[decl.prop];
    const indexes = Object.keys(hashMapData.indexes).map(Number).sort();
    if (indexes.length === 1) {
        return false;
    }
    const overridingIndexes = indexes.filter((i: number) => i > index);
    if (overridingIndexes.length) {
        if (FLIP_PROPERTY_REGEXP.test(decl.prop)) {
            if (declarationHashMap[declFlipped.prop]) {
                const hashMapFlippedData = declarationHashMap[declFlipped.prop];
                const flippedIndexes = Object.keys(hashMapFlippedData.indexes).map(Number).sort();
                const lastFlippedIndex = flippedIndexes.slice(-1)[0];
                const lastIndex = overridingIndexes.slice(-1)[0];
                if (hashMapData.indexes[lastIndex].value === hashMapFlippedData.indexes[lastFlippedIndex].value) {
                    hashMapData.ignore = true;
                    hashMapFlippedData.ignore = true;
                }
                return true;
            }
            return false;
        }
        return true;
    }
    return false;
};

const hasSameUpcomingDeclaration = (
    container: DeclarationContainer,
    decl: Declaration,
    declarationHashMap: DeclarationHashMap
): boolean => {
    const index = container.index(decl);
    const indexes = Object.keys(declarationHashMap[decl.prop].indexes).map(Number);
    if (indexes.length === 1) {
        return false;
    }
    return indexes.some((i: number) => i > index);
};

const hasMirrorDeclaration = (
    container: DeclarationContainer,
    declFlipped: Declaration,
    declarationHashMap: DeclarationHashMap
): boolean => {
    if (declarationHashMap[declFlipped.prop]) {
        const entries = Object.entries(declarationHashMap[declFlipped.prop].indexes);
        return entries.some((entry) => {
            return (
                entry[1].value === declFlipped.value.trim() &&
                !hasSameUpcomingDeclaration(container, entry[1].decl, declarationHashMap)
            );
        });
    }
    return false;
};

export {
    declarations,
    allDeclarations,
    initialValues,
    appendDeclarationToRule,
    hasIgnoreDirectiveInRaws,
    checkOverrides,
    hasSameUpcomingDeclaration,
    hasMirrorDeclaration,
    hasSameUpcomingDeclarationWithoutMirror
};