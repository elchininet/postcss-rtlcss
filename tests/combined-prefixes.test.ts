import postcss from 'postcss';
import { postcssRTLCSS, PluginOptions, Mode } from '../src';
import { readCSSFile } from './test-utils';

const baseOptions: PluginOptions = {mode: Mode.combined};

describe('Combined Tests Prefixes', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('input.css');
  });

  it('Combined custom ltrPrefix and rtlPrefix', (): void => {
    const options: PluginOptions = { ...baseOptions, ltrPrefix: '.ltr', rtlPrefix: '.rtl' };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined custom ltrPrefix and rtlPrefix properties as arrays', (): void => {
    const options: PluginOptions = { ...baseOptions, ltrPrefix: ['.ltr', '.left-to-right'], rtlPrefix: ['.rtl', '.right-to-left'] };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined custom ltrPrefix, rtlPrefix, and bothPrefix properties as arrays and processUrls: true', (): void => {
    const options: PluginOptions = { ...baseOptions, ltrPrefix: ['.ltr', '.left-to-right'], rtlPrefix: ['.rtl', '.right-to-left'], bothPrefix: ['.ltr', '.left-to-right', '.rtl', '.right-to-left'], processUrls: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});