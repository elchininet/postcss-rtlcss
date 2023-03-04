import React, { useState, useEffect } from 'react';
import postcss, { LazyResult, Result } from 'postcss';
import postcssRTLCSS from 'postcss-rtlcss';
import { PluginOptions } from '@types';
import { CSSPanel } from '@components/CSSPanel';
import { useAppContext } from '@components/AppProvider';
import { cssLines } from './css';
import styles from './Playground.module.scss';

const flipLines = (lines: string, options: PluginOptions = {}): LazyResult => {
    return postcss([postcssRTLCSS(options)]).process(lines);   
};

export const Playground = (): JSX.Element => {
    
    const { ready, fetchCode, setCode, options, windowSizes } = useAppContext();
    const { isSmallScreen, panelHeight, panelWidth } = windowSizes;
    const [ lines, setLines ] = useState<string>(cssLines);
    const [ linesFlipped, setLinesFlipped ] = useState<string>('');

    useEffect((): void => {
        flipLines(lines, options).then((result: Result): void => {
            setLinesFlipped(result.css);
        }).catch((error): void => {           
            setLinesFlipped(`/* ${error.name}: ${error.message} */`);
        });
        setCode(lines);
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
        <div className={styles.wrapper}>
            <CSSPanel
                title="css input"
                lines={
                    ready
                        ? fetchCode || cssLines
                        : ''
                }
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