import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Source } from '../src/@types';
import { readCSSFile, runTests } from './utils';

runTests({}, (pluginOptions: PluginOptions): void => {

  describe(`[[Mode: ${pluginOptions.mode}]] safeBothPrefix Option Tests: `, (): void => {

    let input = '';
  
    beforeEach(async (): Promise<void> => {
      input = input || await readCSSFile('input.css');
    });
  
    it('{safeBothPrefix: true}', (): void => {
      const options: PluginOptions = { ...pluginOptions, safeBothPrefix: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('{safeBothPrefix: true} and {source: rtl}', (): void => {
      const options: PluginOptions = { ...pluginOptions, source: Source.rtl, safeBothPrefix: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('{safeBothPrefix: true} and {processUrls: true}', (): void => {
      const options: PluginOptions = { ...pluginOptions, safeBothPrefix: true, processUrls: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('{safeBothPrefix: true} and {processKeyFrames: true}', (): void => {
      const options: PluginOptions = { ...pluginOptions, safeBothPrefix: true, processKeyFrames: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
  });

});