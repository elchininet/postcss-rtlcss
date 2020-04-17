import { ObjectProps, NumberOrString, NumberOrStringArray } from '@types';
import facepaint from 'facepaint';
import { CSSObject } from '@emotion/core';

type StyleSheet = ObjectProps<NumberOrString | NumberOrStringArray | StyleSheet>;
type FacepaintStyleSheetObject = ObjectProps<CSSObject[]>;

interface BreakpointsObject {
    small: number;      // Phones in landscape mode
    medium: number;     // Tablet devices
    large: number;      // Desktop devices
    extralarge: number; // Large desktop devices
}

export const breakpointSizes: BreakpointsObject = {
    small: 576,
    medium: 768,
    large: 992,
    extralarge: 1200
};

type MediaQueryObject = {
    [key in keyof BreakpointsObject]?: string;
};

type BreakpointsKeyValueArray = [keyof BreakpointsObject, number];

const mediaQueries = Object.entries(breakpointSizes).reduce((bp: MediaQueryObject, [key, value]: BreakpointsKeyValueArray): MediaQueryObject => {
    bp[key] = `@media (min-width: ${value}px)`;
    return bp;
}, {});

const facePaintMediaQueries = facepaint([
    mediaQueries.small,
    mediaQueries.medium,
    mediaQueries.large,
    mediaQueries.extralarge
]);

export const parse = (stylesheet: StyleSheet): FacepaintStyleSheetObject =>
    Object.entries(stylesheet).reduce((styles: FacepaintStyleSheetObject, [key, value]: [string, StyleSheet]): FacepaintStyleSheetObject => {
        styles[key] = facePaintMediaQueries(value);
        return styles;
    }, {});

export const shorthands = (...props: (string | number)[]): string => props.map((p: string | number) => typeof p === 'string' ? p : `${p}px`).join(' ');

const transformParams = '0.25s ease-in-out';

export const buildTransition = (...transforms: string[]): string =>
    transforms.map((t: string) => `${t} ${transformParams}`).join(', ');