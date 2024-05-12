import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions } from '../src/@types';
import {
    readCSSFile,
    runTests,
    createSnapshotFileName
} from './utils';
import 'jest-specific-snapshot';

const BASE_NAME = 'overriding';

runTests({}, (pluginOptions: PluginOptions): void => {

    describe(`[[Mode: ${pluginOptions.mode}]] Overriding Tests: `, (): void => {

        let input = '';

        beforeEach(async (): Promise<void> => {
            input = input || await readCSSFile('overriding.css');
        });

        it('Basic', (): void => {
            const options: PluginOptions = { ...pluginOptions };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'basic', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('With safeBothPrefix', (): void => {
            const options: PluginOptions = { ...pluginOptions, safeBothPrefix: true };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'with-safe-both-prefix', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

    });

});