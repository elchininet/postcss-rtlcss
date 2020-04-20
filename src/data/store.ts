import {
    PluginOptions,
    PluginOptionsNormalized,
    AtRulesObject,
    AtRulesStringMap,
    RulesObject,
    strings,
    Mode,
    ModeValues,
    Source,
    SourceValues,
    StringMap,
    PluginStringMap
} from '@types';
import { getKeyFramesStringMap, getKeyFramesRegExp } from '@parsers/atrules';
import { BOOLEAN_TYPE } from '@constants';

interface Store {
    options: PluginOptionsNormalized;
    keyframes: AtRulesObject[];
    keyframesStringMap: AtRulesStringMap;
    keyframesRegExp: RegExp;
    rules: RulesObject[];
}

const defaultStringMap = [
    {
        search : ['left', 'Left', 'LEFT'],
        replace : ['right', 'Right', 'RIGHT']
    },
    {
        search  : ['ltr', 'Ltr', 'LTR'],
        replace : ['rtl', 'Rtl', 'RTL'],
    }
];

const getStringMapName = (map: PluginStringMap): string => {
    const search = Array.isArray(map.search) ? map.search[0] : map.search;
    const replace = Array.isArray(map.replace) ? map.replace[0] : map.replace;
    const reg = /[^\w]/g;
    const searchName = search.replace(reg, '-');
    const replaceName = replace.replace(reg, '_');
    return `${searchName}-${replaceName}`;
};

const getRTLCSSStringMap = (stringMap: PluginStringMap[]): StringMap[] =>
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

const defaultOptions = {
    mode: Mode.combined,
    ltrPrefix: '[dir="ltr"]',
    rtlPrefix: '[dir="rtl"]',
    bothPrefix: '[dir]',
    source: Source.ltr,
    processUrls: false,
    processKeyFrames: false,
    useCalc: false,
    stringMap: getRTLCSSStringMap(defaultStringMap)
};

const defaultKeyframesRegExp = new RegExp('$-^');

const store: Store = {
    options: {...defaultOptions},
    keyframes: [],
    keyframesStringMap: {},
    keyframesRegExp: defaultKeyframesRegExp,
    rules: []
};

export const normalizeOptions = (options: PluginOptions): PluginOptionsNormalized => {
    const returnOptions: PluginOptionsNormalized = {...defaultOptions};
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
    if (!isNotAcceptedPrefix(options.bothPrefix)) {
        returnOptions.bothPrefix = options.bothPrefix;
    }
    if (typeof options.processUrls === BOOLEAN_TYPE) {
        returnOptions.processUrls = options.processUrls;
    }
    if (typeof options.processKeyFrames === BOOLEAN_TYPE) {
        returnOptions.processKeyFrames = options.processKeyFrames;
    }
    if (typeof options.useCalc === BOOLEAN_TYPE) {
        returnOptions.useCalc = options.useCalc;
    }
    if (!isNotAcceptedStringMap(options.stringMap)) {
        returnOptions.stringMap = getRTLCSSStringMap(options.stringMap);
    }
    return returnOptions;
};

const initStore = (options: PluginOptions): void => {
    store.options = normalizeOptions(options);
    store.keyframes = [];
    store.keyframesStringMap = {};
    store.keyframesRegExp = defaultKeyframesRegExp;
    store.rules = [];
};

const initKeyframesData = (): void => {
    store.keyframesStringMap = getKeyFramesStringMap(store.keyframes);
    store.keyframesRegExp = getKeyFramesRegExp(store.keyframesStringMap);
};

export { store, initStore, initKeyframesData };