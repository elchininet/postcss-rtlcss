import postcss from 'postcss';
// @ts-ignore
import postcssPresetEnv from 'postcss-preset-env';
import postcssRTLCSS from '../src';
import { PluginOptions } from '../src/@types';
import {
    readCSSFile,
    runTests,
    createSnapshotFileName
} from './utils';
import 'jest-specific-snapshot';

const BASE_NAME = 'logical-properties';

runTests({}, (pluginOptions: PluginOptions): void => {

    describe(`[[Mode: ${pluginOptions.mode}]] runOnExit Tests: `, (): void => {

        let input = '';

        beforeEach(async (): Promise<void> => {
            input = input || await readCSSFile('logical-properties.css');
        });

        it('runOnExit false', (): void => {
            const options: PluginOptions = pluginOptions;
            const output = postcss([
                postcssPresetEnv(),
                postcssRTLCSS(options)
            ]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME, 'false', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('runOnExit true', (): void => {
            const options: PluginOptions = {
                ...pluginOptions,
                runOnExit: true
            };
            const output = postcss([
                postcssPresetEnv(),
                postcssRTLCSS(options)
            ]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME, 'true', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

    });

});