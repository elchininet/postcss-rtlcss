import React, { useState, useEffect } from 'react';
import postcss, { LazyResult, Result } from 'postcss';
import postcssRTLCSS from 'postcss-rtlcss';
import { PluginOptions } from 'postcss-rtlcss/@types';
import { CSSPanel } from '@components/CSSPanel';
import { useAppContext } from '@components/AppProvider';
import { cssLines } from './css';
import { stylesheet } from './stylesheet';

const flipLines = (lines: string, options: PluginOptions = {}): LazyResult => {
    return postcss([postcssRTLCSS(options)]).process(lines);   
};

export const Playground = (): JSX.Element => {
    
    const { options, windowSizes } = useAppContext();
    const { isSmallScreen, panelHeight, panelWidth } = windowSizes;
    const [ lines, setLines ] = useState<string>(cssLines);
    const [ linesFlipped, setLinesFlipped ] = useState<string>('');

    useEffect((): void => {
        flipLines(lines, options).then((result: Result): void => {
            setLinesFlipped(result.css);
        }).catch((error): void => {           
            setLinesFlipped(`/* ${error.name}: ${error.message} */`);
        }); 
    }, [ lines, options ]);

    const onChangeCode = (code: string): void => {  
        setLines(code);       
    };

    const comonProps = {
        isMobile: isSmallScreen,
        height: panelHeight,
        width: panelWidth
    };
    
    return (
        <div css={stylesheet.wrapper}>
            <CSSPanel
                title="css input"
                lines={cssLines}
                readOnly={isSmallScreen}
                onChange={onChangeCode}
                { ...comonProps }
            />
            <CSSPanel
                title="css output"
                lines={linesFlipped}
                readOnly={true}
                { ...comonProps }
            />
        </div>
    );
};