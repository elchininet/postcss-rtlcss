import postcss, { Root, Transformer } from 'postcss';
import { PluginOptions } from '@types';
import { initStore } from '@data/store';
import { parseKeyFrames, parseAtRules } from '@parsers/atrules';
import { parseRules } from '@parsers/rules';
import { appendRules, appendKeyFrames, appendAutorenameRules } from '@utilities/rules';
export { PluginOptions, Mode, Source, PluginStringMap, Autorename } from '@types';

const transformer = (options: PluginOptions = {}): Transformer  => (
    (css: Root): void => {
        initStore(options);     
        parseKeyFrames(css);
        parseAtRules(css);
        parseRules(css);
        appendRules();
        appendKeyFrames();
        appendAutorenameRules();      
    }
);

export const postcssRTLCSS = postcss.plugin<PluginOptions>('postcss-rtlcss', transformer);