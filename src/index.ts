import postcss, { Root, Transformer } from 'postcss';
import { PluginOptions, RulesObject } from '@types';
import { parseOptions } from '@utilities/options';
import { parseRules } from '@parsers/rules';
import { appendRules } from '@utilities/rules';
export { PluginOptions, Mode, Source, PluginStringMap,  } from '@types';

const transformer = (options: PluginOptions = {}): Transformer  => (
    (css: Root): void => {
        const optionsParsed = parseOptions(options);
        const result: RulesObject[] = [];
        parseRules(result, css, optionsParsed);
        appendRules(result);           
    }
);

export const postcssRTLCSS = postcss.plugin<PluginOptions>('postcss-rtlcss', transformer);