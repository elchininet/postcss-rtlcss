import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Source } from '../src/@types';
import {
  readCSSFile,
  runTests,
  createSnapshotFileName
} from './utils';
import 'jest-specific-snapshot';

const BASE_NAME = 'nested-rules';

runTests({}, (pluginOptions: PluginOptions): void => {

  describe(`[[Mode: ${pluginOptions.mode}]] Nested rules tests: `, (): void => {

    let input = '';
  
    beforeEach(async (): Promise<void> => {
      input = input || await readCSSFile('input-nested.scss');
    });
  
    it('{source: rtl}', (): void => {
      const options: PluginOptions = { ...pluginOptions, source: Source.rtl };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'source-rtl', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });

    it('{source: rtl} processRuleNames: true', (): void => {
      const options: PluginOptions = { ...pluginOptions, source: Source.rtl, processRuleNames: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'source-rtl-process-rule-names-true', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('{source: ltr}', (): void => {
      const options: PluginOptions = { ...pluginOptions, source: Source.ltr };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'source-ltr', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });

    it('{source: ltr} processRuleNames: true', (): void => {
      const options: PluginOptions = { ...pluginOptions, source: Source.ltr, processRuleNames: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'source-ltr-process-rule-names-true', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });
  
  });

});