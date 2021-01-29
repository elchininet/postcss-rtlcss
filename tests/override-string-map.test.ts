import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Mode } from '../src/@types';
import { readCSSFile } from './test-utils';

const baseOptions: PluginOptions = {mode: Mode.override};

describe('Override Tests String Map', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('input.css');
  });

  it('Override custom string map and processUrls: true', (): void => {
    const stringMap: PluginOptions['stringMap'] = [
      {name: 'left-right', search: 'left', replace: 'right'},
      {name: 'ltr-rtl', search: 'ltr', replace: 'rtl'},
      {name: 'prev-next', search: 'prev', replace: 'next'}
    ];
    const options: PluginOptions = { ...baseOptions, processUrls: true, stringMap };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override custom string map without names and processUrls: true', (): void => {
    const stringMap: PluginOptions['stringMap'] = [
      {search: 'left', replace: 'right'},
      {search: 'ltr', replace: 'rtl'},
      {search: ['prev', 'Prev'], replace: ['next', 'Next']}
    ];
    const options: PluginOptions = { ...baseOptions, processUrls: true, stringMap };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override custom no-valid string map and processUrls: true (different types)', (): void => {
    const stringMap: PluginOptions['stringMap'] = [
      {search: ['left', 'rtl'], replace: 'right'}
    ];
    const options: PluginOptions = { ...baseOptions, processUrls: true, stringMap };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override custom no-valid string map and processUrls: true (different lenghts)', (): void => {
    const stringMap: PluginOptions['stringMap'] = [
      {search: ['left', 'rtl'], replace: ['right']}
    ];
    const options: PluginOptions = { ...baseOptions, processUrls: true, stringMap };
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});