import { ObjectWithProps, ShortHandsData } from '@types';
import shorthandsJson from '@data/shorthands.json';

const shorthandsData: ShortHandsData = shorthandsJson;
const shorthands: ObjectWithProps<string[]> = {};

const getDependencies = (prop: string): string[] => {
    const overridenProp = shorthandsData[prop].overridden;
    const overridden = overridenProp ? [overridenProp].concat(getDependencies(overridenProp)) : [];
    return overridden;
};

Object.keys(shorthandsData).forEach((prop: string): void => {

    shorthands[prop] = getDependencies(prop);

    shorthandsData[prop].overrides.forEach((oprop: string): void => {

        const overridden = [prop];

        shorthands[oprop] = overridden.concat(getDependencies(prop));

    });

});

export { shorthands };