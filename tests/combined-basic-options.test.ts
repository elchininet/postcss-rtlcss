import postcss from 'postcss';
import { postcssRTLCSS, PluginOptions, Mode, Source } from '../src';
import { readCSSFile } from './test-utils';

const baseOptions: PluginOptions = {mode: Mode.combined};

describe('Combined Tests Basic Options', (): void => {

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

});