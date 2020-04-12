import postcss from 'postcss';
import { postcssRTLCSS, PluginOptions } from '../src';
import { readCSSFile } from './test-utils';

describe('Combined Tests', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('input-noflip.css');
  });

  it('Combined No Flip', (): void => {
    const output = postcss([postcssRTLCSS()]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

  it('Override No Flip', (): void => {
    const options: PluginOptions = {mode: 'override'}; 
    const output = postcss([postcssRTLCSS(options)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});