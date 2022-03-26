import postcssRTLCSS from 'postcss-rtlcss';

export type NumberOrString = string | number;
export type NumberOrStringArray = NumberOrString[];

export interface ObjectProps<T> {
    [key: string]: T;
}

export type PluginOptions = Parameters<typeof postcssRTLCSS>[0];