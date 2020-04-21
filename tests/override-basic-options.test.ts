import postcss from 'postcss';
import { postcssRTLCSS, PluginOptions, Mode, Source } from '../src';
import { readCSSFile } from './test-utils';

const baseOptions: PluginOptions = {mode: Mode.override};

describe('Override Tests Basic Options', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('input.css');
  });

  it('Override Basic', (): void => {
    const options: PluginOptions = { ...baseOptions };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override {source: rtl}', (): void => {
    const options: PluginOptions = { ...baseOptions, source: Source.rtl };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override {processUrls: true}', (): void => {
    const options: PluginOptions = { ...baseOptions, processUrls: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override {processKeyFrames: true}', (): void => {
    const options: PluginOptions = { ...baseOptions, processKeyFrames: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override {source: rtl, processKeyFrames: true}', (): void => {
    const options: PluginOptions = { ...baseOptions, source: Source.rtl, processKeyFrames: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override {useCalc: true}', (): void => {
    const options: PluginOptions = { ...baseOptions, useCalc: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});