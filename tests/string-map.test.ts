import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions } from '../src/@types';
import {
    readCSSFile,
    runTests,
    createSnapshotFileName
} from './utils';
import 'jest-specific-snapshot';

const BASE_NAME = 'string-map';

runTests({}, (pluginOptions: PluginOptions): void => {

    describe(`[[Mode: ${pluginOptions.mode}]] String Map Tests: `, (): void => {

        let input = '';

        beforeEach(async (): Promise<void> => {
            input = input || await readCSSFile('input.css');
        });

        it('custom string map and processUrls: true', (): void => {
            const stringMap: PluginOptions['stringMap'] = [
                {name: 'left-right', search: 'left', replace: 'right'},
                {name: 'ltr-rtl', search: 'ltr', replace: 'rtl'},
                {name: 'prev-next', search: 'prev', replace: 'next'}
            ];
            const options: PluginOptions = { ...pluginOptions, processUrls: true, stringMap };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'custom-string-map-process-urls-true', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('custom string map without names and processUrls: true', (): void => {
            const stringMap: PluginOptions['stringMap'] = [
                {search: 'left', replace: 'right'},
                {search: 'ltr', replace: 'rtl'},
                {search: ['prev', 'Prev'], replace: ['next', 'Next']}
            ];
            const options: PluginOptions = { ...pluginOptions, processUrls: true, stringMap };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'custom-string-map-without-names-process-urls-true', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('custom no-valid string map and processUrls: true (different types)', (): void => {
            const stringMap: PluginOptions['stringMap'] = [
                {search: ['left', 'rtl'], replace: 'right'}
            ];
            const options: PluginOptions = { ...pluginOptions, processUrls: true, stringMap };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'custom-non-valid-string-different-types-map-process-urls-true', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('custom no-valid string map and processUrls: true (different lenghts)', (): void => {
            const stringMap: PluginOptions['stringMap'] = [
                {search: ['left', 'rtl'], replace: ['right']}
            ];
            const options: PluginOptions = { ...pluginOptions, processUrls: true, stringMap };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'custom-non-valid-string-different-lengths-map-process-urls-true', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

    });

});