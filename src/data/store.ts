import { AtRule } from 'postcss';
import {
    PluginOptions,
    PluginOptionsNormalized,
    DeclarationContainer,
    DeclarationPlugin,
    DeclarationPluginProcessor,
    AtRulesObject,
    AtRulesStringMap,
    RulesObject,
    UnmodifiedRulesObject,
    strings,
    Mode,
    ModeValue,
    Source,
    SourceValue,
    StringMap,
    PluginStringMap
} from '@types';
import { REG_EXP_CHARACTERS_REG_EXP, LAST_WORD_CHARACTER_REG_EXP } from '@constants';
import {
    isBoolean,
    isFunction,
    isNumber,
    isString
} from '@utilities/predicates';

interface Store {
    options: PluginOptionsNormalized;
    keyframes: AtRulesObject[];
    keyframesToRemove: AtRule[];
    keyframesStringMap: AtRulesStringMap;
    keyframesRegExp: RegExp;
    rules: RulesObject[];
    containersToRemove: DeclarationContainer[];
    rulesPrefixRegExp: RegExp;
    unmodifiedRules: UnmodifiedRulesObject[];
}

const defaultRegExp = new RegExp('$-^');

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
            scope: 'url',
            ignoreCase: false
        }
    }));

const ModeValuesArray = Object.keys(Mode).map((prop: ModeValue) => Mode[prop] as ModeValue);
const SourceValuesArray = Object.keys(Source).map((prop: SourceValue) => Source[prop] as SourceValue);

const isNotStringOrStringArray = (value: strings): boolean => {
    if (!isString(value) && !Array.isArray(value)) {
        return true;
    }
    if (Array.isArray(value)) {
        return value.some((item: string): boolean => !isString(item));
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

const isAcceptedProcessDeclarationPlugins = (plugins: DeclarationPlugin[]): boolean =>
    Array.isArray(plugins)
    && plugins.every((plugin: DeclarationPlugin) =>
        isString(plugin.name)
            && isNumber(plugin.priority)
            && Array.isArray(plugin.processors)
            && plugin.processors.every((processor: DeclarationPluginProcessor) =>
                processor.expr instanceof RegExp
                && isFunction(processor.action)
            )
    );

const isObjectWithStringKeys = (obj: Record<string, unknown>): boolean =>
    !Object.entries(obj).some(
        (entry: [string, unknown]): boolean =>
            !isString(entry[1])
    );

const spreadArrayOfStrings = (arr: string[], item: strings): string[] => {
    return isString(item)
        ? [...arr, item]
        : [...arr, ...item];
};

const createRulesPrefixesRegExp = (options: PluginOptionsNormalized): RegExp => {
    const { ltrPrefix, rtlPrefix, bothPrefix, ignorePrefixedRules } = options;
    if (!ignorePrefixedRules) return defaultRegExp;
    let prefixes: string[] = [];
    prefixes = spreadArrayOfStrings(prefixes, ltrPrefix);
    prefixes = spreadArrayOfStrings(prefixes, rtlPrefix);
    prefixes = spreadArrayOfStrings(prefixes, bothPrefix);
    prefixes = prefixes.map((p: string): string => {
        const escaped = p.replace(REG_EXP_CHARACTERS_REG_EXP, '\\$&');
        return LAST_WORD_CHARACTER_REG_EXP.test(p)
            ? `${escaped}(?:\\W|$)`
            : escaped;
    });
    return new RegExp(`(${prefixes.join('|')})`);
};

const defaultOptions = (): PluginOptionsNormalized => ({
    mode: Mode.combined,
    ltrPrefix: '[dir="ltr"]',
    rtlPrefix: '[dir="rtl"]',
    bothPrefix: '[dir]',
    prefixSelectorTransformer: null,
    safeBothPrefix: false,
    ignorePrefixedRules: true,
    source: Source.ltr,
    processUrls: false,
    processRuleNames: false,
    processKeyFrames: false,
    processEnv: true,
    useCalc: false,
    stringMap: getRTLCSSStringMap(defaultStringMap),
    greedy: false,
    aliases: {},
    plugins: []
});

const store: Store = {
    options: {...defaultOptions()},
    keyframes: [],
    keyframesToRemove: [],
    keyframesStringMap: {},
    keyframesRegExp: defaultRegExp,
    rules: [],
    containersToRemove: [],
    rulesPrefixRegExp: defaultRegExp,
    unmodifiedRules: []
};

const normalizeOptions = (options: PluginOptions): PluginOptionsNormalized => {
    const returnOptions: PluginOptionsNormalized = {...defaultOptions()};
    if (options.mode && ModeValuesArray.includes(options.mode)) {
        returnOptions.mode = options.mode;
    }
    if (options.source && SourceValuesArray.includes(options.source)) {
        returnOptions.source = options.source;
    }
    if (isBoolean(options.ignorePrefixedRules)) {
        returnOptions.ignorePrefixedRules = options.ignorePrefixedRules;
    }
    if (isBoolean(options.greedy)) {
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
    if (isFunction(options.prefixSelectorTransformer)) {
        returnOptions.prefixSelectorTransformer = options.prefixSelectorTransformer;
    }
    if (isBoolean(options.safeBothPrefix)) {
        returnOptions.safeBothPrefix = options.safeBothPrefix;
    }
    if (isBoolean(options.processUrls)) {
        returnOptions.processUrls = options.processUrls;
    }
    if (isBoolean(options.processRuleNames)) {
        returnOptions.processRuleNames = options.processRuleNames;
    }
    if (isBoolean(options.processKeyFrames)) {
        returnOptions.processKeyFrames = options.processKeyFrames;
    }
    if (isBoolean(options.processEnv)) {
        returnOptions.processEnv = options.processEnv;
    }
    if (isBoolean(options.useCalc)) {
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
    if (isAcceptedProcessDeclarationPlugins(options.processDeclarationPlugins)) {
        returnOptions.plugins = options.processDeclarationPlugins.map(plugin => ({
            ...plugin,
            directives: {
                control: {},
                value: [] as object[]
            },
        }));
    }
    if (options.aliases && isObjectWithStringKeys(options.aliases)) {
        returnOptions.aliases = options.aliases;
    }
    return returnOptions;
};

const initStore = (options: PluginOptions): void => {
    store.options = normalizeOptions(options);
    store.keyframes = [];
    store.keyframesToRemove = [];
    store.keyframesStringMap = {};
    store.keyframesRegExp = defaultRegExp;
    store.rules = [];
    store.containersToRemove = [];
    store.rulesPrefixRegExp = createRulesPrefixesRegExp(store.options);
    store.unmodifiedRules = [];
};

const getKeyFramesStringMap = (keyframes: AtRulesObject[]): AtRulesStringMap => {
    const stringMap: AtRulesStringMap = {};
    keyframes.forEach((obj: AtRulesObject): void => {
        stringMap[obj.atRuleParams] = {
            name: obj.atRule.params,
            nameFlipped: obj.atRuleFlipped.params
        };
    });
    return stringMap;
};

const getKeyFramesRegExp = (stringMap: AtRulesStringMap): RegExp => new RegExp(`(^|[^\\w-]| )(${ Object.keys(stringMap).join('|') })( |[^\\w-]|$)`, 'g');

const initKeyframesData = (): void => {
    store.keyframesStringMap = getKeyFramesStringMap(store.keyframes);
    store.keyframesRegExp = getKeyFramesRegExp(store.keyframesStringMap);
};

export { store, initStore, initKeyframesData };
