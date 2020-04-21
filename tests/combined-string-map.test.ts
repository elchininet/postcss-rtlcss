import postcss from 'postcss';
import { postcssRTLCSS, PluginOptions, Mode } from '../src';
import { readCSSFile } from './test-utils';

const baseOptions: PluginOptions = {mode: Mode.combined};

describe('Combined Tests String Map', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('input.css');
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

  it('Combined custom no-valid string map and processUrls: true (different types)', (): void => {
    const stringMap: PluginOptions['stringMap'] = [
      {search: ['left', 'rtl'], replace: 'right'}
    ];
    const options: PluginOptions = { ...baseOptions, processUrls: true, stringMap };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Combined custom no-valid string map and processUrls: true (different lenghts)', (): void => {
    const stringMap: PluginOptions['stringMap'] = [
      {search: ['left', 'rtl'], replace: ['right']}
    ];
    const options: PluginOptions = { ...baseOptions, processUrls: true, stringMap };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});