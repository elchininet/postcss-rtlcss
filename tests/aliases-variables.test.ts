import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions } from '../src/@types';
import {
  readCSSFile,
  runTests,
  createSnapshotFileName
} from './utils';
import { aliases } from './constants';
import 'jest-specific-snapshot';

const BASE_NAME = 'aliases-variables';

const baseOptions: PluginOptions = { aliases };

runTests(baseOptions, (pluginOptions: PluginOptions): void => {

  describe(`[[Mode: ${pluginOptions.mode}]] Variables Tests:`, (): void => {

    let input = '';
  
    beforeEach(async (): Promise<void> => {
      input = input || await readCSSFile('input-variables.css');
    });
  
    it('aliases default', (): void => {
      const options: PluginOptions = { ...pluginOptions, aliases: {} };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'aliases-default', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('aliases map', (): void => {
      const options: PluginOptions = { ...pluginOptions };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'aliases-map', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('wrong aliases', (): void => {
      const options: PluginOptions = { ...pluginOptions, aliases: {base: true, parse: false} as unknown as Record<string, string> };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'wrong-aliases', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });

    it('processEnv = true', (): void => {
      const options: PluginOptions = { ...pluginOptions };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'process-env-true', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });

    it('processEnv = false', (): void => {
        const options: PluginOptions = { ...pluginOptions, processEnv: false };
        const output = postcss([postcssRTLCSS(options)]).process(input);
        expect(output.css).toMatchSpecificSnapshot(
          createSnapshotFileName(BASE_NAME,'process-env-false', pluginOptions.mode)
        );
        expect(output.warnings()).toHaveLength(0);
    });
  
  });

});