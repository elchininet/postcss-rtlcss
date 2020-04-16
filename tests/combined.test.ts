import postcss from 'postcss';
import { postcssRTLCSS, PluginOptions, Mode, Source } from '../src';
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

  it('Combined {processKeyFrames: true}', (): void => {
    const options: PluginOptions = { ...baseOptions, processKeyFrames: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined {source: rtl, processKeyFrames: true}', (): void => {
    const options: PluginOptions = { ...baseOptions, source: Source.rtl, processKeyFrames: true };
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

  it('Combined custom string map and processUrls: true', (): void => {
    const stringMap: PluginOptions['stringMap'] = [
      {search: 'left', replace: 'right'}
    ];
    const options: PluginOptions = { ...baseOptions, processUrls: true, stringMap };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});