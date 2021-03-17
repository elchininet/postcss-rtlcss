import React, { PropsWithChildren, createContext, useContext, useState, useEffect } from 'react';
import { PluginOptions, Mode, Source, Autorename } from 'postcss-rtlcss/@types';
import { useApi } from '@hooks/useApi';
import { breakpointSizes } from '@utilities/styles';

export interface WindowSizes {
    windowHeight: number;
    windowWidth: number;
    panelHeight: number;
    panelWidth: number;
    isSmallScreen: boolean;
}

export interface AppProviderContext {
    canShare: boolean;
    ready: boolean;
    token: string;
    fetchCode: string;
    code: string;
    optionsOpen: boolean;
    options: PluginOptions;
    windowSizes: WindowSizes;
    setCode: (code: string) => void;
    share: (code: string) => void;
    setOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    changeOptionsMode: (mode: Mode) => void;
    changeOptionsSource: (source: Source) => void;
    changeOptionsSafeBothPrefix: (safeBothPrefix: boolean) => void;
    changeOptionsProcessUrls: (processUrls: boolean) => void;
    changeOptionsProcessKeyframes: (processKeyFrames: boolean) => void;
    changeOptionsUseCalc: (useCalc: boolean) => void;
    changeOptionsAutoRename: (value: Autorename) => void;
    changeOptionsGreedy: (greedy: boolean) => void;
}

const getWindowSizes = (): WindowSizes => {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const isSmallScreen = width < breakpointSizes.small;
    const panelHeight = isSmallScreen
        ? (height - 150) / 2
        : height - 120;
    const panelWidth = isSmallScreen
        ? width - 10
        : Math.floor((width - 30) / 2);

    return {
        windowHeight: height,
        windowWidth: width,
        panelHeight,
        panelWidth,
        isSmallScreen
    };
};

const defaultOptions: PluginOptions = {};

const windowSizes = getWindowSizes();

export const AppContext = createContext<AppProviderContext>({} as AppProviderContext);

export const AppProvider = (props: PropsWithChildren<{}>): JSX.Element => {

    let delay: number;
    const [ code, setCode ] = useState<string>(null);
    const [ options, setOptions ] = useState<PluginOptions>(defaultOptions);
    const [ sizes, setSizes ] = useState<WindowSizes>(windowSizes);
    const [ optionsOpen, setOptionsOpen ] = useState<boolean>(false);
    const { canShare, ready, token, fetchCode, share } = useApi();

    useEffect(() => {
        window.removeEventListener('resize', resize);
        window.addEventListener('resize', resize);
        return (): void => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    const resize = (): void => {
        if (delay) window.clearTimeout(delay);
        delay = window.setTimeout((): void => {            
            const windowSizes = getWindowSizes();
            setSizes(windowSizes);       
        }, 100);
    };

    const changeOptionsMode = (mode: Mode): void => setOptions({ ...options, mode });
    const changeOptionsSource = (source: Source): void => setOptions({ ...options, source });
    const changeOptionsSafeBothPrefix = (safeBothPrefix: boolean): void => setOptions({...options, safeBothPrefix});
    const changeOptionsProcessUrls = (processUrls: boolean): void => setOptions({ ...options, processUrls });
    const changeOptionsProcessKeyframes = (processKeyFrames: boolean): void => setOptions({ ...options, processKeyFrames });
    const changeOptionsUseCalc = (useCalc: boolean): void => setOptions({ ...options, useCalc });
    const changeOptionsAutoRename = (value: Autorename): void => setOptions({ ...options, autoRename: value });
    const changeOptionsGreedy = (greedy: boolean): void => setOptions({ ...options, greedy });

    const providerData = {
        canShare,
        ready,
        token,
        fetchCode,
        code,
        options,
        optionsOpen,
        setCode,
        share,
        setOptionsOpen,
        changeOptionsMode,
        changeOptionsSource,
        changeOptionsSafeBothPrefix,
        changeOptionsProcessUrls,
        changeOptionsProcessKeyframes,
        changeOptionsUseCalc,
        changeOptionsAutoRename,
        changeOptionsGreedy,
        windowSizes: sizes        
    };

    return (
        <AppContext.Provider value={providerData}>
            { props.children }
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppProviderContext => useContext<AppProviderContext>(AppContext);