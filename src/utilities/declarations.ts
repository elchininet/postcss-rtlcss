import { Rule, Declaration } from 'postcss';
import {
    ObjectWithProps,
    DeclarationsData,
    DeclarationHashMapProp
} from '@types';
import { COMMENT_TYPE, RTL_COMMENT_IGNORE_REGEXP } from '@constants';
import shorthandDeclarationsJson from '@data/shorthand-declarations.json';
import notShorthandDeclarationsJson from '@data/not-shorthand-declarations.json';
import initialValuesJson from '@data/initial-values.json';

const declarationsData: DeclarationsData = shorthandDeclarationsJson;
const notShorthandDeclarationsArray: string[] = notShorthandDeclarationsJson;
const initialValuesData: ObjectWithProps<string[]> = initialValuesJson;
const declarations: ObjectWithProps<string[]> = {};
const allDeclarations: ObjectWithProps<string[]> = {};
const initialValues: ObjectWithProps<string> = {};

const getOverrideTree = (prop: string): string[] => {
    const overridenProp = declarationsData[prop].overridden;
    const overridden = overridenProp ? [overridenProp].concat(getOverrideTree(overridenProp)) : [];
    return overridden;
};

Object.keys(declarationsData).forEach((prop: string): void => {
    const overrideTree =  getOverrideTree(prop);
    declarations[prop] = overrideTree;
    declarationsData[prop].overrides.forEach((oprop: string): void => {
        declarations[oprop] = [prop].concat(overrideTree);
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

const appendDeclarationToRule = (decl: Declaration, rule: Rule): void => {
    const declClone = decl.clone();
    const declPrev = decl.prev();
    if (declPrev && declPrev.type === COMMENT_TYPE) {
        const commentClone = declPrev.clone();
        rule.append(commentClone);
        declPrev.remove();
    }
    rule.append(declClone);
};

const hasIgnoreDirectiveInRaws = (decl: Declaration): boolean => {
    // @ts-ignore
    const raws = !!decl.raws && !!decl.raws.value && decl.raws.value.raw;
    if (raws && RTL_COMMENT_IGNORE_REGEXP.test(raws)) {
        return true;
    }
    return false;
};

const hasSameUpcomingDeclaration = (
    rule: Rule,
    decl: Declaration,
    declarationHashMap: DeclarationHashMapProp
): boolean => {
    const index = rule.index(decl);
    const indexes = Object.keys(declarationHashMap[decl.prop]).map(Number);
    if (indexes.length === 1) {
        return false;
    }
    return indexes.some((i: number) => i > index);
};

const hasMirrorDeclaration = (
    rule: Rule,
    declFlipped: Declaration,
    declarationHashMap: DeclarationHashMapProp
): boolean => {
    if (declarationHashMap[declFlipped.prop]) {
        const entries = Object.entries(declarationHashMap[declFlipped.prop]);
        return entries.some((entry) => {
            return (
                entry[1].value === declFlipped.value.trim() &&
                !hasSameUpcomingDeclaration(rule, entry[1].decl, declarationHashMap)
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
    hasSameUpcomingDeclaration,
    hasMirrorDeclaration
};