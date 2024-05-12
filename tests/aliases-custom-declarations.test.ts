import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions } from '../src/@types';
import {
    readCSSFile,
    runTests,
    createSnapshotFileName
} from './utils';
import { propsAliases } from './constants';
import 'jest-specific-snapshot';

const BASE_NAME = 'aliases-custom-declarations';

const baseOptions: PluginOptions = {
    aliases: propsAliases
};

runTests(baseOptions, (pluginOptions: PluginOptions): void => {

    describe(`[[Mode: ${pluginOptions.mode}]] Aliases Tests:`, (): void => {
        
        let input = '';
  
        beforeEach(async (): Promise<void> => {
            input = input || await readCSSFile('input-aliases.css');
        });
  
        it('without aliases and safeBothPrefix false', (): void => {
            const options: PluginOptions = { ...pluginOptions, aliases: {} };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'no-aliases-safe-both-prefix-false', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('without aliases and safeBothPrefix true', (): void => {
            const options: PluginOptions = { ...pluginOptions, aliases: {}, safeBothPrefix: true };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'no-aliases-safe-both-prefix-true', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('with aliases and safeBothPrefix false', (): void => {
            const options: PluginOptions = { ...pluginOptions };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'with-aliases-safe-both-prefix-false', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

        it('with aliases and safeBothPrefix true', (): void => {
            const options: PluginOptions = { ...pluginOptions, safeBothPrefix: true };
            const output = postcss([postcssRTLCSS(options)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'with-aliases-safe-both-prefix-true', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });
  
    });

});