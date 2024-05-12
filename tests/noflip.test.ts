import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Mode } from '../src/@types';
import {
    readCSSFile,
    runTests,
    createSnapshotFileName
} from './utils';
import 'jest-specific-snapshot';

const BASE_NAME = 'noflip';

runTests({}, (pluginOptions: PluginOptions): void => {

    describe(`[[Mode: ${pluginOptions.mode}]] Combined Tests: `, (): void => {

        let input = '';

        beforeEach(async (): Promise<void> => {
            input = input || await readCSSFile('input-noflip.css');
        });

        it('No Flip', (): void => {
            const output = pluginOptions.mode === Mode.combined
                ? postcss([postcssRTLCSS()]).process(input)
                : postcss([postcssRTLCSS(pluginOptions)]).process(input);
            expect(output.css).toMatchSpecificSnapshot(
                createSnapshotFileName(BASE_NAME,'no-flip', pluginOptions.mode)
            );
            expect(output.warnings()).toHaveLength(0);
        });

    });

});