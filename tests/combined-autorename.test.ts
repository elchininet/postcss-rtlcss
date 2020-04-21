import postcss from 'postcss';
import { postcssRTLCSS, PluginOptions, Mode, Autorename } from '../src';
import { readCSSFile } from './test-utils';

const baseOptions: PluginOptions = {mode: Mode.combined};

describe('Combined Tests Autorename', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('input.css');
  });

  it('Combined Autorename: flexible', (): void => {
    const options: PluginOptions = { ...baseOptions, autoRename: Autorename.flexible };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined Autorename: flexible with custom string map', (): void => {
    const stringMap: PluginOptions['stringMap'] = [
      {search: 'left', replace: 'right'},
      {search: 'prev', replace: 'next'}
    ];
    const options: PluginOptions = { ...baseOptions, autoRename: Autorename.flexible, stringMap };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined Autorename: flexible, greedy: true', (): void => {
    const options: PluginOptions = { ...baseOptions, autoRename: Autorename.flexible, greedy: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined Autorename: strict', (): void => {
    const options: PluginOptions = { ...baseOptions, autoRename: Autorename.strict };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined Autorename: strict, greedy: true', (): void => {
    const options: PluginOptions = { ...baseOptions, autoRename: Autorename.strict, greedy: true };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});