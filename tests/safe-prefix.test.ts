import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Source } from '../src/@types';
import {
  readCSSFile,
  runTests,
  createSnapshotFileName
} from './utils';
import 'jest-specific-snapshot';

const BASE_NAME = 'safe-prefix';

runTests({}, (pluginOptions: PluginOptions): void => {

  describe(`[[Mode: ${pluginOptions.mode}]] safeBothPrefix Option Tests: `, (): void => {

    let input = '';
  
    beforeEach(async (): Promise<void> => {
      input = input || await readCSSFile('input.css');
    });
  
    it('{safeBothPrefix: true}', (): void => {
      const options: PluginOptions = { ...pluginOptions, safeBothPrefix: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'safe-both-prefix-true', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('{safeBothPrefix: true} and {source: rtl}', (): void => {
      const options: PluginOptions = { ...pluginOptions, source: Source.rtl, safeBothPrefix: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'safe-both-prefix-true-rtl', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('{safeBothPrefix: true} and {processUrls: true}', (): void => {
      const options: PluginOptions = { ...pluginOptions, safeBothPrefix: true, processUrls: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'safe-both-prefix-true-process-urls-true', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('{safeBothPrefix: true} and {processKeyFrames: true}', (): void => {
      const options: PluginOptions = { ...pluginOptions, safeBothPrefix: true, processKeyFrames: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'safe-both-prefix-true-process-keyframes-true', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });
  
  });

});