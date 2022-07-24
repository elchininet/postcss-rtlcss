import postcss from 'postcss';
import { postcssRTLCSS, PluginOptions, Mode, Source } from '../src';
import { readCSSFile } from './test-utils';

describe('Combined Overriding Tests', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('overriding.css');
  });

  it('Basic', (): void => {
    const output = postcss([postcssRTLCSS()]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});