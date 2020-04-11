import {
    PluginOptions,
    PluginOptionsParsed,
    PluginStringMap,
    StringMap,
    Mode,
    ModeValues,
    Source,
    SourceValues,
    strings
} from '@types';
import { BOOLEAN_TYPE } from '@constants';

const defaultOptions: PluginOptionsParsed = {
    mode: Mode.combined,
    ltrPrefix: '[dir="ltr"]',
    rtlPrefix: '[dir="rtl"]',
    source: Source.ltr,
    processUrls: false,
    useCalc: false,
    stringMap: [
        {
            search : ['left', 'Left', 'LEFT'],
            replace : ['right', 'Right', 'RIGHT']
        },
        {
            search  : ['ltr', 'Ltr', 'LTR'],
            replace : ['rtl', 'Rtl', 'RTL'],
        }
    ]
};

const ModeValuesArray = Object.keys(Mode).map((prop: ModeValues) => Mode[prop] as ModeValues);
const SourceValuesArray = Object.keys(Source).map((prop: SourceValues) => Source[prop] as SourceValues);
const isNotAcceptedPrefix = (prefix: strings): boolean => {
    if (typeof prefix !== 'string' && !Array.isArray(prefix)) {
        return true;
    }
    if (Array.isArray(prefix)) {
        return prefix.some((item: string): boolean => typeof item !== 'string');
    }
    return false;
};
const isNotAcceptedStringMap = (stringMap: PluginStringMap[]): boolean => {
    if (!Array.isArray(stringMap)) {
        return true;
    }
    return stringMap.some((map: PluginStringMap) =>
        isNotAcceptedPrefix(map.search) || isNotAcceptedPrefix(map.replace)
    );
};

export const parseOptions = (options: PluginOptions): PluginOptionsParsed => {
    const returnOptions: PluginOptionsParsed = {...defaultOptions};
    if (options.mode && ModeValuesArray.includes(options.mode)) {
        returnOptions.mode = options.mode;
    }
    if (options.source && SourceValuesArray.includes(options.source)) {
        returnOptions.source = options.source;
    }
    if (!isNotAcceptedPrefix(options.ltrPrefix)) {
        returnOptions.ltrPrefix = options.ltrPrefix;
    }
    if (!isNotAcceptedPrefix(options.rtlPrefix)) {
        returnOptions.rtlPrefix = options.rtlPrefix;
    }
    if (typeof options.processUrls === BOOLEAN_TYPE) {
        returnOptions.processUrls = options.processUrls;
    }
    if (typeof options.useCalc === BOOLEAN_TYPE) {
        returnOptions.useCalc = options.useCalc;
    }
    if (!isNotAcceptedStringMap(options.stringMap)) {
        returnOptions.stringMap = options.stringMap;
    }
    return returnOptions;
};

const getStringMapName = (map: PluginStringMap): string => {
    const search = Array.isArray(map.search) ? map.search[0] : map.search;
    const replace = Array.isArray(map.replace) ? map.replace[0] : map.replace;
    const reg = /[^\w]/g;
    const searchName = search.replace(reg, '-');
    const replaceName = replace.replace(reg, '_');
    return `${searchName}-${replaceName}`;
};

export const getRTLCSSStringMap = (stringMap: PluginStringMap[]): StringMap[] =>
    stringMap.map((map: PluginStringMap): StringMap => ({
        name: getStringMapName(map),
        priority: 100,
        search: map.search,
        replace: map.replace,
        options: {
            scope: '*',
            ignoreCase: false
        }
    }));