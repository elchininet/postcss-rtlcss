import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Autorename } from '../src/@types';
import { readCSSFile, runTests } from './utils';

runTests({}, (pluginOptions: PluginOptions): void => {

  describe(`[[Mode: ${pluginOptions.mode}]] Autorename Tests: `, (): void => {

    let input = '';
  
    beforeEach(async (): Promise<void> => {
      input = input || await readCSSFile('input.css');
    });
  
    it('only control directives', (): void => {
      const options: PluginOptions = { ...pluginOptions, autoRename: Autorename.disabled };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('only control directives, greedy: true', (): void => {
      const options: PluginOptions = { ...pluginOptions, autoRename: Autorename.disabled, greedy: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('flexible', (): void => {
      const options: PluginOptions = { ...pluginOptions, autoRename: Autorename.flexible };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('flexible with custom string map', (): void => {
      const stringMap: PluginOptions['stringMap'] = [
        {search: 'left', replace: 'right'},
        {search: 'prev', replace: 'next'}
      ];
      const options: PluginOptions = { ...pluginOptions, autoRename: Autorename.flexible, stringMap };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('flexible, greedy: true', (): void => {
      const options: PluginOptions = { ...pluginOptions, autoRename: Autorename.flexible, greedy: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('strict', (): void => {
      const options: PluginOptions = { ...pluginOptions, autoRename: Autorename.strict };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('strict, greedy: true', (): void => {
      const options: PluginOptions = { ...pluginOptions, autoRename: Autorename.strict, greedy: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
  });

});