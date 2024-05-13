import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Source } from '../src/@types';
import {
    readCSSFile,
    runTests,
    createSnapshotFileName
} from './utils';
import 'jest-specific-snapshot';

const BASE_NAME = 'basic-options';

runTests({}, (pluginOptions: PluginOptions): void => {

    describe(`[[Mode: ${pluginOptions.mode}]] Basic Options Tests: `, (): void => {

        let input = '';

        beforeEach(async (): Promise<void> => {
            input = input || await readCSSFile('input.css');
        });

        it('Basic', (): void => {
            const options: PluginOptions = { ...pluginOptions };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'basic', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('{source: rtl}', (): void => {
            const options: PluginOptions = { ...pluginOptions, source: Source.rtl };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'source-rtl', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('{processUrls: true}', (): void => {
            const options: PluginOptions = { ...pluginOptions, processUrls: true };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'process-url-true', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('{processKeyFrames: true}', (): void => {
            const options: PluginOptions = { ...pluginOptions, processKeyFrames: true };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'process-keyframes-true', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('{source: rtl, processKeyFrames: true}', (): void => {
            const options: PluginOptions = { ...pluginOptions, source: Source.rtl, processKeyFrames: true };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'source-rtl-and-process-keyframes-true', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('{useCalc: true}', (): void => {
            const options: PluginOptions = { ...pluginOptions, useCalc: true };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'use-calc-true', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

    });

});