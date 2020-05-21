import { Rule } from 'postcss';
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
    Autorename,
    AutorenameValues,
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
    rulesAutoRename: Rule[];
}

const defaultStringMap = [
    {
        name: 'left-right',
        search : ['left', 'Left', 'LEFT'],
        replace : ['right', 'Right', 'RIGHT']
    },
    {
        name: 'ltr-rtl',
        search  : ['ltr', 'Ltr', 'LTR'],
        replace : ['rtl', 'Rtl', 'RTL'],
    }
];

const getStringMapName = (map: PluginStringMap): string => {
    if (map.name) { return map.name; }
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
const AutorenameValuesArray = Object.keys(Autorename).map((prop: AutorenameValues) => Autorename[prop] as AutorenameValues);
const isNotStringOrStringArray = (value: strings): boolean => {
    if (typeof value !== 'string' && !Array.isArray(value)) {
        return true;
    }
    if (Array.isArray(value)) {
        return value.some((item: string): boolean => typeof item !== 'string');
    }
    return false;
};

const isNotAcceptedStringMap = (stringMap: PluginStringMap[]): boolean => {
    if (!Array.isArray(stringMap)) {
        return true;
    }
    return stringMap.some((map: PluginStringMap) =>
        typeof map.search !== typeof map.replace ||
        isNotStringOrStringArray(map.search) ||
        isNotStringOrStringArray(map.replace) ||
        (
            Array.isArray(map.search) &&
            Array.isArray(map.replace) &&
            map.search.length !== map.replace.length
        )
    );
};

const defaultOptions = (): PluginOptionsNormalized => ({
    mode: Mode.combined,
    ltrPrefix: '[dir="ltr"]',
    rtlPrefix: '[dir="rtl"]',
    bothPrefix: '[dir]',
    safeBothPrefix: false,
    source: Source.ltr,
    processUrls: false,
    processKeyFrames: false,
    useCalc: false,
    stringMap: getRTLCSSStringMap(defaultStringMap),
    autoRename: Autorename.disabled,
    greedy: false
});

const defaultKeyframesRegExp = new RegExp('$-^');

const store: Store = {
    options: {...defaultOptions()},
    keyframes: [],
    keyframesStringMap: {},
    keyframesRegExp: defaultKeyframesRegExp,
    rules: [],
    rulesAutoRename: []
};

export const normalizeOptions = (options: PluginOptions): PluginOptionsNormalized => {
    const returnOptions: PluginOptionsNormalized = {...defaultOptions()};
    if (options.mode && ModeValuesArray.includes(options.mode)) {
        returnOptions.mode = options.mode;
    }
    if (options.source && SourceValuesArray.includes(options.source)) {
        returnOptions.source = options.source;
    }
    if (options.autoRename && AutorenameValuesArray.includes(options.autoRename)) {
        returnOptions.autoRename = options.autoRename;
    }
    if (typeof options.greedy === BOOLEAN_TYPE) {
        returnOptions.greedy = options.greedy;
    }
    if (!isNotStringOrStringArray(options.ltrPrefix)) {
        returnOptions.ltrPrefix = options.ltrPrefix;
    }
    if (!isNotStringOrStringArray(options.rtlPrefix)) {
        returnOptions.rtlPrefix = options.rtlPrefix;
    }
    if (!isNotStringOrStringArray(options.bothPrefix)) {
        returnOptions.bothPrefix = options.bothPrefix;
    }
    if (typeof options.safeBothPrefix === BOOLEAN_TYPE) {
        returnOptions.safeBothPrefix = options.safeBothPrefix;
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
        const stringMap = getRTLCSSStringMap(options.stringMap);
        stringMap.forEach((map: StringMap): void => {
            if (map.name === defaultStringMap[0].name) {
                returnOptions.stringMap.splice(0, 1, map);
            } else if (map.name === defaultStringMap[1].name) {
                returnOptions.stringMap.splice(1, 1, map);
            } else {
                returnOptions.stringMap.push(map);
            }
        });
    }
    return returnOptions;
};

const initStore = (options: PluginOptions): void => {
    store.options = normalizeOptions(options);
    store.keyframes = [];
    store.keyframesStringMap = {};
    store.keyframesRegExp = defaultKeyframesRegExp;
    store.rules = [];
    store.rulesAutoRename = [];
};

const initKeyframesData = (): void => {
    store.keyframesStringMap = getKeyFramesStringMap(store.keyframes);
    store.keyframesRegExp = getKeyFramesRegExp(store.keyframesStringMap);
};

export { store, initStore, initKeyframesData };