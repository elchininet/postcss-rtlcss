import { ObjectWithProps, ShortHandsData } from '@types';
import shorthandsJson from '@data/shorthands.json';

const shorthandsData: ShortHandsData = shorthandsJson;
const shorthands: ObjectWithProps<string | null> = {};

Object.keys(shorthandsData).forEach((prop: string): void => {

    shorthands[prop] = shorthandsData[prop].overridden;

    shorthandsData[prop].overrides.forEach((oprop: string): void => {

        shorthands[oprop] = prop;

    });

});

export { shorthands };