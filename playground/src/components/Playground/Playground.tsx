import React, { useState, useCallback, useEffect } from 'react';
import postcss, { LazyResult, Result } from 'postcss';
import { postcssRTLCSS } from 'postcss-rtlcss';
import { editor } from 'monaco-editor';
import { CSSPanel } from '@components/CSSPanel';
import { cssLines } from './css';
import { stylesheet } from './stylesheet';
import { breakpointSizes } from '@utilities/styles';

interface WindowSizes {
    windowHeight: number;
    windowWidth: number;
    panelHeight: number;
    panelWidth: number;
    isSmallScreen: boolean;
}

const errorReg = /^(<[^>]*>:)?(.*)$/;

const getWindowSizes = (): WindowSizes => {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const isSmallScreen = width < breakpointSizes.small;
    const panelHeight = isSmallScreen
        ? Math.floor((height - 170) / 2)
        : height - 110;
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

const flipLines = (lines: string): LazyResult => {
    return postcss([postcssRTLCSS()]).process(lines);   
};

export const Playground = (): JSX.Element => {

    let delay: number;
    const windowSizes = getWindowSizes();
    const [ sizes, setSizes ] = useState<WindowSizes>(windowSizes);
    const [linesFlipped, setLinesFlipped] = useState<string>();    

    const onChangeCode = (code: string): void => {            
        flipLines(code).then((result: Result): void => {
            setLinesFlipped(result.css);
        }).catch((error): void => {           
            setLinesFlipped(`/* ${error.name}: ${error.message} */`);
        });        
    };

    const resize = (): void => {

        if (delay) window.clearTimeout(delay);

        delay = window.setTimeout((): void => {            
            const windowSizes = getWindowSizes();
            setSizes(windowSizes);       
        }, 100);
    };

    useEffect(() => {

        onChangeCode(cssLines);

        window.removeEventListener('resize', resize);
        window.addEventListener('resize', resize);

        return (): void => {
            window.removeEventListener('resize', resize);
        };

    }, []);
    
    return (
        <div css={stylesheet.wrapper}>
            <CSSPanel
                title="css input"
                lines={cssLines}
                readOnly={sizes.isSmallScreen}
                onChange={onChangeCode}
                height={sizes.panelHeight}
                width={sizes.panelWidth}
            />
            <CSSPanel
                title="css output"
                lines={linesFlipped}
                readOnly={true}
                height={sizes.panelHeight}
                width={sizes.panelWidth}
            />
        </div>
    );
};