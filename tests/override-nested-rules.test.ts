import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Mode, Source } from '../src/@types';
import { readCSSFile } from './test-utils';

const baseOptions: PluginOptions = {mode: Mode.override};

describe('Override Tests Nested rules', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('input-nested.scss');
  });

  it('Override {source: rtl}', (): void => {
    const options: PluginOptions = { ...baseOptions, source: Source.rtl };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override {source: ltr}', (): void => {
    const options: PluginOptions = { ...baseOptions, source: Source.ltr };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});