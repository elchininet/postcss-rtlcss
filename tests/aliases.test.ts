import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions } from '../src/@types';
import { readCSSFile, runTests } from './utils';
import { aliases } from './constants';

const baseOptions: PluginOptions = { aliases };

runTests(baseOptions, (pluginOptions: PluginOptions): void => {

  describe(`[[Mode: ${pluginOptions.mode}]] Aliases Tests:`, (): void => {

    let input = '';
  
    beforeEach(async (): Promise<void> => {
      input = input || await readCSSFile('input-variables.css');
    });
  
    it('aliases default', (): void => {
      const options: PluginOptions = { ...pluginOptions, aliases: {} };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('aliases map', (): void => {
      const options: PluginOptions = { ...pluginOptions };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('wrong aliases', (): void => {
      const options: PluginOptions = { ...pluginOptions, aliases: {base: true, parse: false} as unknown as Record<string, string> };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
  });

});