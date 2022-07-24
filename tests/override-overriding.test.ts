import postcss from 'postcss';
import { postcssRTLCSS, PluginOptions, Mode, Source } from '../src';
import { readCSSFile } from './test-utils';

const baseOptions: PluginOptions = {mode: Mode.override};

describe('Override Overriding Tests', (): void => {

  let input = '';

  beforeEach(async (): Promise<void> => {
    input = input || await readCSSFile('overriding.css');
  });

  it('Basic', (): void => {
    const output = postcss([postcssRTLCSS(baseOptions)]).process(input);
    expect(output.css).toMatchSnapshot();
    expect(output.warnings()).toHaveLength(0);
  });

});