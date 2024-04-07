import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions } from '../src/@types';
import {
    readCSSFile,
    runTests,
    createSnapshotFileName
} from './utils';
import 'jest-specific-snapshot';

const BASE_NAME = 'empty-rules';

runTests({}, (pluginOptions: PluginOptions): void => {
    describe(`[[Mode: ${pluginOptions.mode}]] Empty Rules Tests: `, () => {
        let input = '';
  
        beforeEach(async (): Promise<void> => {
            input = input || await readCSSFile('empty-rules.css');
        });

        it('Basic', (): void => {
            const options: PluginOptions = { ...pluginOptions };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'basic', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
          });
    });
});