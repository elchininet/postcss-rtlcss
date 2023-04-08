import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions } from '../src/@types';
import { readCSSFile, runTests } from './utils';

runTests({}, (pluginOptions: PluginOptions): void => {
    describe(`[[Mode: ${pluginOptions.mode}]] Empty Rules Tests: `, () => {
        let input = '';
  
        beforeEach(async (): Promise<void> => {
            input = input || await readCSSFile('empty-rules.css');
        });

        it('Basic', (): void => {
            const options: PluginOptions = { ...pluginOptions };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSnapshot();
            expect(output.warnings()).toHaveLength(0);
          });
    });
});