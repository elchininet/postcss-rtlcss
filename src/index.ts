import { Root, Plugin } from 'postcss';
import { PluginOptions, Parsers } from '@types';
import { initStore } from '@data/store';
import { parseAtRules } from '@parsers/atrules';
import { parseRules } from '@parsers/rules';
import { parseKeyFrames } from '@parsers/keyframes';
import { parseDeclarations } from '@parsers/declarations';
import {
    appendRules,
    appendKeyFrames,
    parseRuleNames
} from '@utilities/rules';
import { clean } from '@utilities/clean';

const parsers: Parsers = {
    parseRules,
    parseAtRules,
    parseKeyFrames,
    parseDeclarations
};

function postcssRTLCSS (options: PluginOptions = {}): Plugin {
    return ({
        postcssPlugin: 'postcss-rtlcss',
        Once(css: Root): void {
            initStore(options);
            parseKeyFrames(css);
            parseAtRules(parsers, css);
            parseRules(parsers, css);
            parseRuleNames();
            appendRules();
            appendKeyFrames();
            clean(css);
        }
    });
}

postcssRTLCSS.postcss = true;

export default postcssRTLCSS;