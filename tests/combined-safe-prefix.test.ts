import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Mode, Source } from '../src/@types';
import { readCSSFile } from './test-utils';

const baseOptions: PluginOptions = {mode: Mode.combined};

describe('Combined Tests safeBothPrefix Option', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('input.css');
  });

  it('Combined {safeBothPrefix: true}', (): void => {
    const options: PluginOptions = { ...baseOptions, safeBothPrefix: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined {safeBothPrefix: true} and {source: rtl}', (): void => {
    const options: PluginOptions = { ...baseOptions, source: Source.rtl, safeBothPrefix: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined {safeBothPrefix: true} and {processUrls: true}', (): void => {
    const options: PluginOptions = { ...baseOptions, safeBothPrefix: true, processUrls: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined {safeBothPrefix: true} and {processKeyFrames: true}', (): void => {
    const options: PluginOptions = { ...baseOptions, safeBothPrefix: true, processKeyFrames: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});