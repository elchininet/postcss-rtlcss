import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Source } from '../src/@types';
import { readCSSFile, runTests } from './utils';

runTests({}, (pluginOptions: PluginOptions): void => {

  describe(`[[Mode: ${pluginOptions.mode}]] Overriding Tests: `, (): void => {

    let input = '';
  
    beforeEach(async (): Promise<void> => {
      input = input || await readCSSFile('overriding.css');
    });
  
    it('Basic', (): void => {
      const options: PluginOptions = { ...pluginOptions };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
  });

});