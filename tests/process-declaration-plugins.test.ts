import postcss from 'postcss';
import postcssRTLCSS from '../src';
import { PluginOptions, Mode } from '../src/@types';
import {
  readCSSFile,
  runTests,
  createSnapshotFileName
} from './utils';
import 'jest-specific-snapshot';

const BASE_NAME = 'process-declaration-plugins';

runTests({}, (pluginOptions: PluginOptions): void => {

  describe(`[[Mode: ${pluginOptions.mode}]] Combined Tests: `, (): void => {

    let input = '';
  
    beforeEach(async (): Promise<void> => {
      input = input || await readCSSFile(`input-${BASE_NAME}.css`);
    });
    
    it('flip background by default', (): void => {
      const output = postcss([postcssRTLCSS(pluginOptions)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
          createSnapshotFileName(BASE_NAME,'flip', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });

    it('use {processDeclarationPlugins} to avoid flipping background', (): void => {
      const options: PluginOptions = {
        ...pluginOptions,
        processDeclarationPlugins: [{
          name: 'avoid-flipping-background',
          priority: 99, // above the core RTLCSS plugin which has a priority value of 100
          processors: [{
            expr: /(background|object)(-position(-x)?|-image)?$/i,
            action: (prop: string, value: string) => ({prop, value})
          }]
        }]
      };
      const output = postcss([postcssRTLCSS(options)]).process(input);
      expect(output.css).toMatchSpecificSnapshot(
          createSnapshotFileName(BASE_NAME,'noflip', pluginOptions.mode)
      );
      expect(output.warnings()).toHaveLength(0);
    });
  
  });

});