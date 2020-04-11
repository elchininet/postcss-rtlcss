import postcss, { Root, Transformer } from 'postcss';
import { PluginOptions, RulesObject, Mode } from '@types';
import { parseOptions } from '@utilities/options';
import { parseRules } from '@rules/parser';
import { parseRule } from '@utilities/rules';
export { PluginOptions, Mode, Source, PluginStringMap,  } from '@types';

const transformer = (options: PluginOptions = {}): Transformer  => (
    (css: Root): void => {
        const optionsParsed = parseOptions(options);
        const appends: RulesObject[] = parseRules(css, optionsParsed);
        appends.forEach(({rule, ruleLTR, ruleRTL}): void => {
            if (optionsParsed.mode === Mode.combined) {
                rule.after(ruleRTL);
                parseRule(ruleRTL);
                rule.after(ruleLTR);                
                parseRule(ruleLTR);  
            } else {                
                rule.after(ruleLTR || ruleRTL);
                parseRule(ruleLTR || ruleRTL);                
            }
            if (rule.nodes.length === 0) {
                rule.remove();
            }
        });    
    }
);

export default postcss.plugin<PluginOptions>('postcss-rtlcss', transformer);