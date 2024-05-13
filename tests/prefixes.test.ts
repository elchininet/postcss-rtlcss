import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions } from '../src/@types';
import {
    readCSSFile,
    runTests,
    createSnapshotFileName
} from './utils';
import 'jest-specific-snapshot';

const BASE_NAME = 'prefixes';

runTests({}, (pluginOptions: PluginOptions): void => {

    describe(`[[Mode: ${pluginOptions.mode}]] Prefixes Tests: `, (): void => {

        let input = '';

        beforeEach(async (): Promise<void> => {
            input = input || await readCSSFile('input.css');
        });

        it('custom ltrPrefix and rtlPrefix', (): void => {
            const options: PluginOptions = {
                ...pluginOptions,
                ltrPrefix: '.ltr',
                rtlPrefix: '.rtl',
                bothPrefix: ['.ltr', '.rtl']
            };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'custom-ltr-and-rtl-prefix', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('custom ltrPrefix and rtlPrefix properties as arrays', (): void => {
            const options: PluginOptions = {
                ...pluginOptions,
                ltrPrefix: ['.ltr', '.left-to-right'],
                rtlPrefix: ['.rtl', '.right-to-left'],
                bothPrefix: ['.ltr', '.left-to-right', '.rtl', '.right-to-left']
            };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'custom-ltr-and-rtl-prefix-as-arrays', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('custom ltrPrefix, rtlPrefix, and bothPrefix properties as arrays and processUrls: true', (): void => {
            const options: PluginOptions = {
                ...pluginOptions,
                ltrPrefix: ['.ltr', '.left-to-right'],
                rtlPrefix: ['.rtl', '.right-to-left'],
                bothPrefix: ['.ltr', '.left-to-right', '.rtl', '.right-to-left'],
                processUrls: true
            };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'custom-ltr-rtl-and-both-prefix-as-arrays-and-process-urls-true', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('prefixSelectorTransformer with default prefixes', (): void => {
            const transformer = (prefix: string, selector: string) => {
                if (!selector.startsWith('html') && selector.indexOf(':root') < 0) {
                    return `${prefix} > ${selector}`;
                }
            };
            const options: PluginOptions = { ...pluginOptions, prefixSelectorTransformer: transformer };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'prefix-selector-transformer-with-default-prefixes', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('prefixSelectorTransformer with custom ltrPrefix and rtlPrefix', (): void => {
            const transformer = (prefix: string, selector: string) => {
                if (
                    !selector.startsWith('html') &&
                    !selector.startsWith('::view-transition') &&
                    selector.indexOf(':root') < 0
                ) {
                    return `${prefix}${selector}`;
                }
            };
            const options: PluginOptions = {
                ...pluginOptions,
                prefixSelectorTransformer: transformer,
                ltrPrefix: '.ltr',
                rtlPrefix: '.rtl',
                bothPrefix: ['.ltr', '.rtl']
            };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'prefix-selector-transformer-with-custom-ltr-and-rtl-prefixes', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

    });

});