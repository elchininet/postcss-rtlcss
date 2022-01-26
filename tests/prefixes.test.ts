import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions } from '../src/@types';
import { readCSSFile, runTests } from './utils';

runTests({}, (pluginOptions: PluginOptions): void => {

  describe(`[[Mode: ${pluginOptions.mode}]] Prefixes Tests: `, (): void => {

    let input = '';
  
    beforeEach(async (): Promise<void> => {
      input = input || await readCSSFile('input.css');
    });
  
    it('custom ltrPrefix and rtlPrefix', (): void => {
      const options: PluginOptions = { ...pluginOptions, ltrPrefix: '.ltr', rtlPrefix: '.rtl', bothPrefix: ['.ltr', '.rtl'] };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('custom ltrPrefix and rtlPrefix properties as arrays', (): void => {
      const options: PluginOptions = { ...pluginOptions, ltrPrefix: ['.ltr', '.left-to-right'], rtlPrefix: ['.rtl', '.right-to-left'], bothPrefix: ['.ltr', '.left-to-right', '.rtl', '.right-to-left'] };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('custom ltrPrefix, rtlPrefix, and bothPrefix properties as arrays and processUrls: true', (): void => {
      const options: PluginOptions = { ...pluginOptions, ltrPrefix: ['.ltr', '.left-to-right'], rtlPrefix: ['.rtl', '.right-to-left'], bothPrefix: ['.ltr', '.left-to-right', '.rtl', '.right-to-left'], processUrls: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSnapshot();
      expect(output.warnings()).toHaveLength(0);
    });
  
  });

});