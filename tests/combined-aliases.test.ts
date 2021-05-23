import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Mode } from '../src/@types';
import { readCSSFile } from './test-utils';
import { aliases } from './tests-constants';

const baseOptions: PluginOptions = {mode: Mode.combined, aliases};

describe('Aliases Tests', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('input-variables.css');
  });

  it('Aliases default', (): void => {
    const options: PluginOptions = { ...baseOptions, aliases: {} };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Aliases map', (): void => {
    const options: PluginOptions = { ...baseOptions };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Wrong aliases', (): void => {
    const options: PluginOptions = { ...baseOptions, aliases: {base: true, parse: false} as unknown as Record<string, string> };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});