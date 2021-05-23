import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Mode } from '../src/@types';
import { readCSSFile } from './test-utils';

const baseOptions: PluginOptions = {mode: Mode.override, processUrls: true};

describe('Prefixed Tests', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('input-prefixed.css');
  });

  it('Prefixed default', (): void => {
    const options: PluginOptions = { ...baseOptions };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Custom prefixes', (): void => {
    const options: PluginOptions = { ...baseOptions, rtlPrefix: '.rtl', ltrPrefix: '.ltr' };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Prefixed with array', (): void => {
    const options: PluginOptions = { ...baseOptions, rtlPrefix: ['.rtl', '[dir="rtl"]'], ltrPrefix: ['.ltr', '[dir="ltr"]'] };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('ignorePrefixedRules false', (): void => {
    const options: PluginOptions = { ...baseOptions, ignorePrefixedRules: false };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});