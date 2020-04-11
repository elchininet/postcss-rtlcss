import postcss from 'postcss';
import postcssRTLCSS, { PluginOptions, Mode, Source } from '../src';
import { readCSSFile } from './test-utils';

const baseOptions: PluginOptions = {mode: Mode.combined};

describe('Combined Tests', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('input.css');
  });

  it('Combined Basic', (): void => {
    const output = postcss([postcssRTLCSS()]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined {source: rtl}', (): void => {
    const options: PluginOptions = { ...baseOptions, source: Source.rtl };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined {processUrls: true}', (): void => {
    const options: PluginOptions = { ...baseOptions, processUrls: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined {useCalc: true}', (): void => {
    const options: PluginOptions = { ...baseOptions, useCalc: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined custom ltrPrefix and rtlPrefix properties', (): void => {
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

  it('Combined custom string map', (): void => {
    const stringMap: PluginOptions['stringMap'] = [
      {search: 'left', replace: 'right'},
      {search: 'ltr', replace: 'rtl'}
    ];
    const options: PluginOptions = { ...baseOptions, stringMap };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});