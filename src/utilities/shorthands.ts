import { ObjectWithProps, ShortHandsData } from '@types';
import shorthandsJson from '@data/shorthands.json';

const shorthandsData: ShortHandsData = shorthandsJson;
const shorthands: ObjectWithProps<string[]> = {};

const getOverrideTree = (prop: string): string[] => {
    const overridenProp = shorthandsData[prop].overridden;
    const overridden = overridenProp ? [overridenProp].concat(getOverrideTree(overridenProp)) : [];
    return overridden;
};

Object.keys(shorthandsData).forEach((prop: string): void => {
    const overrideTree =  getOverrideTree(prop);
    shorthands[prop] = overrideTree;
    shorthandsData[prop].overrides.forEach((oprop: string): void => {
        shorthands[oprop] = [prop].concat(overrideTree);
    });

});

export { shorthands };