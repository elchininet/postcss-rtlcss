import postcss from 'postcss';
import { postcssRTLCSS, PluginOptions, Mode } from '../src';
import { readCSSFile } from './test-utils';

const baseOptions: PluginOptions = {mode: Mode.override};

describe('Override Tests Prefixes', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('input.css');
  });

  it('Override custom ltrPrefix and rtlPrefix properties', (): void => {
    const options: PluginOptions = {
      ...baseOptions,
      ltrPrefix: '.ltr',
      rtlPrefix: '.rtl'
    };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override custom ltrPrefix and rtlPrefix properties as arrays', (): void => {
    const options: PluginOptions = {
      ...baseOptions,
      ltrPrefix: ['.ltr', '.left-to-right'],
      rtlPrefix: ['.rtl', '.right-to-left']
    };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override custom ltrPrefix, rtlPrefix, and bothPrefix properties as arrays and processUrls: true', (): void => {
    const options: PluginOptions = {
      ...baseOptions,
      ltrPrefix: ['.ltr', '.left-to-right'],
      rtlPrefix: ['.rtl', '.right-to-left'],
      bothPrefix: ['.ltr', '.left-to-right', '.rtl', '.right-to-left'],
      processUrls: true
    };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override prefixSelectorTransformer with default prefixes', (): void => {
    const transformer = (prefix: string, selector: string) => {
      if (!selector.startsWith('html') && selector.indexOf(':root') < 0) {
        return `${prefix} > ${selector}`;
      }
    };
    const options: PluginOptions = { ...baseOptions, prefixSelectorTransformer: transformer };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override prefixSelectorTransformer with custom ltrPrefix and rtlPrefix', (): void => {
    const transformer = (prefix: string, selector: string) => {
      if (!selector.startsWith('html') && selector.indexOf(':root') < 0) {
        return `${prefix}${selector}`;
      }
    };
    const options: PluginOptions = {
      ...baseOptions,
      prefixSelectorTransformer: transformer,
      ltrPrefix: '.ltr',
      rtlPrefix: '.rtl',
      bothPrefix: ['.ltr', '.rtl']
    };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});