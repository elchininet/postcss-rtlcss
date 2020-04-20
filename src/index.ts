import postcss, { Root, Transformer } from 'postcss';
import { PluginOptions } from '@types';
import { store, initStore } from '@data/store';
import { parseKeyFrames, parseAtRules } from '@parsers/atrules';
import { parseRules } from '@parsers/rules';
import { appendRules, appendKeyFrames } from '@utilities/rules';
export { PluginOptions, Mode, Source, PluginStringMap,  } from '@types';

const transformer = (options: PluginOptions = {}): Transformer  => (
    (css: Root): void => {
        initStore(options);        
        store.options.processKeyFrames && parseKeyFrames(css);
        parseAtRules(css);
        parseRules(css);
        appendRules();
        appendKeyFrames();                 
    }
);

export const postcssRTLCSS = postcss.plugin<PluginOptions>('postcss-rtlcss', transformer);