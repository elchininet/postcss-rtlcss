import { AtRule } from 'postcss';
import { Mode } from '@types';
import { store } from '@data/store';

export const addToIgnoreKeyframesInDiffMode = (node: AtRule): void => {
    if (store.options.mode === Mode.diff) {
        store.keyframesToRemove.push(node);
    }
};