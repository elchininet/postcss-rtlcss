import React, { PropsWithChildren, createContext, useContext, useState, useEffect } from 'react';
import { PluginOptions, Mode, Source } from 'postcss-rtlcss';
import { breakpointSizes } from '@utilities/styles';

export interface WindowSizes {
    windowHeight: number;
    windowWidth: number;
    panelHeight: number;
    panelWidth: number;
    isSmallScreen: boolean;
}

export interface AppProviderContext {
    optionsOpen: boolean;
    options: PluginOptions;
    windowSizes: WindowSizes;
    setOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    changeOptionsMode: (mode: Mode) => void;
    changeOptionsSource: (source: Source) => void;
    changeOptionsProcessUrls: (processUrls: boolean) => void;
    changeOptionsProcessKeyframes: (processKeyFrames: boolean) => void;
    changeOptionsUseCalc: (useCalc: boolean) => void;
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

export const AppContext = createContext<AppProviderContext>({
    optionsOpen: false,
    options: defaultOptions,
    windowSizes,    
    setOptionsOpen: (): void => {},
    changeOptionsMode: (mode: Mode): void => {},
    changeOptionsSource: (source: Source): void => {},
    changeOptionsProcessUrls: (processUrls: boolean): void => {},
    changeOptionsProcessKeyframes: (processKeyFrames: boolean) => {},
    changeOptionsUseCalc: (useCalc: boolean) => {}
});

export const AppProvider = (props: PropsWithChildren<{}>): JSX.Element => {

    let delay: number;
    const [ options, setOptions ] = useState<PluginOptions>(defaultOptions);
    const [ sizes, setSizes ] = useState<WindowSizes>(windowSizes);
    const [ optionsOpen, setOptionsOpen ] = useState<boolean>(false);
    
    const resize = (): void => {
        if (delay) window.clearTimeout(delay);
        delay = window.setTimeout((): void => {            
            const windowSizes = getWindowSizes();
            setSizes(windowSizes);       
        }, 100);
    };

    useEffect(() => {
        window.removeEventListener('resize', resize);
        window.addEventListener('resize', resize);
        return (): void => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    const changeOptionsMode = (mode: Mode): void => setOptions({ ...options, mode });
    const changeOptionsSource = (source: Source): void => setOptions({ ...options, source });
    const changeOptionsProcessUrls = (processUrls: boolean): void => setOptions({ ...options, processUrls });
    const changeOptionsProcessKeyframes = (processKeyFrames: boolean): void => setOptions({ ...options, processKeyFrames });
    const changeOptionsUseCalc = (useCalc: boolean): void => setOptions({ ...options, useCalc });
    
    const providerData = {
        options,
        optionsOpen,
        setOptionsOpen,
        changeOptionsMode,
        changeOptionsSource,
        changeOptionsProcessUrls,
        changeOptionsProcessKeyframes,
        changeOptionsUseCalc,
        windowSizes: sizes        
    };

    return (
        <AppContext.Provider value={providerData}>
            { props.children }
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);