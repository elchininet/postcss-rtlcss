import postcss, { Root, Transformer } from 'postcss';
import { PluginOptions, RulesObject, AtRulesObject, KeyFramesData } from '@types';
import { normalizeOptions } from '@utilities/options';
import { parseKeyFrames, parseAtRules, getKeyFramesStringMap, getKeyFramesRegExp } from '@parsers/atrules';
import { parseRules } from '@parsers/rules';
import { appendRules, appendKeyFrames } from '@utilities/rules';
export { PluginOptions, Mode, Source, PluginStringMap,  } from '@types';

const transformer = (options: PluginOptions = {}): Transformer  => (
    (css: Root): void => {

        const optionsParsed = normalizeOptions(options);
        const keyframes: AtRulesObject[] = [];
        const rules: RulesObject[] = [];
        
        if (optionsParsed.processKeyFrames) {
            parseKeyFrames(keyframes, css, optionsParsed);
        }

        const keyFramesStringMap = getKeyFramesStringMap(keyframes);

        const keyFrameData: KeyFramesData = {
            length: keyframes.length,
            keyframes,
            stringMap: keyFramesStringMap,
            regExp: getKeyFramesRegExp(keyFramesStringMap)
        };

        parseAtRules(rules, keyFrameData, css, optionsParsed);
        parseRules(rules, keyFrameData, css, optionsParsed);

        appendRules(rules);
        appendKeyFrames(keyframes); 
                
    }
);

export const postcssRTLCSS = postcss.plugin<PluginOptions>('postcss-rtlcss', transformer);