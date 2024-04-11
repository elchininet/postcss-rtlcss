import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Source } from '../src/@types';
import {
  readCSSFile,
  runTests,
  createSnapshotFileName
} from './utils';
import 'jest-specific-snapshot';

const BASE_NAME = 'rule-names';

runTests({}, (pluginOptions: PluginOptions): void => {

  describe(`[[Mode: ${pluginOptions.mode}]] processRuleNames Tests: `, (): void => {

    let input = '';
  
    beforeEach(async (): Promise<void> => {
      input = input || await readCSSFile('input.css');
    });
  
    it('processRuleNames: true', (): void => {
      const options: PluginOptions = { ...pluginOptions, processRuleNames: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'process-rules-names-true', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('processRuleNames: true, greedy: true', (): void => {
      const options: PluginOptions = { ...pluginOptions, processRuleNames: true, greedy: true };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'process-rules-names-true-greedy-true', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });

    it('processRuleNames: true, with source rtl greedy: true', (): void => {
      const options: PluginOptions = { ...pluginOptions, processRuleNames: true, greedy: true, source: Source.rtl };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'process-rules-names-true-source-rtl-greedy-true', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });
  
    it('processRuleNames: true with custom string map', (): void => {
      const stringMap: PluginOptions['stringMap'] = [
        {search: 'left', replace: 'right'},
        {search: 'prev', replace: 'next'}
      ];
      const options: PluginOptions = { ...pluginOptions, processRuleNames: true, stringMap };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'process-rules-names-true-with-custom-string-map', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });

    it('processRuleNames: true with custom string map and greedy: true', (): void => {
      const stringMap: PluginOptions['stringMap'] = [
        {search: 'left', replace: 'right'},
        {search: 'prev', replace: 'next'}
      ];
      const options: PluginOptions = { ...pluginOptions, processRuleNames: true, greedy: true, stringMap };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'process-rules-names-true-with-custom-string-map-and-greedy-true', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });

    it('processRuleNames: true with custom string map, source rtl and greedy: true', (): void => {
      const stringMap: PluginOptions['stringMap'] = [
        {search: 'left', replace: 'right'},
        {search: 'prev', replace: 'next'}
      ];
      const options: PluginOptions = { ...pluginOptions, processRuleNames: true, greedy: true, stringMap, source: Source.rtl };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
        createSnapshotFileName(BASE_NAME,'process-rules-names-true-with-custom-string-map-rtl-and-greedy-true', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });
  
  });

});