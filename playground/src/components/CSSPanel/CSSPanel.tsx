import React, {useEffect, useRef} from 'react';
import { editor, languages } from 'monaco-editor';
import { stylesheet } from './stylesheet';

export interface CSSPanelProps {
    title: string;
    height?: number;
    width?: number;
    lines?: string;
    readOnly?: boolean;
    onChange?: (code: string) => void;
}

export const CSSPanel = (props: CSSPanelProps): JSX.Element => {

    const { title, height, width, lines = '', readOnly = false, onChange } = props;
    const panel = useRef<editor.IStandaloneCodeEditor>(null);
    const panelContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {

        panel.current = editor.create(panelContainer.current, {
            value: lines,
            minimap: {
                enabled: false
            },
            readOnly,
            scrollbar: {
                alwaysConsumeMouseWheel: true
            },
            theme: 'vs-dark',
            scrollBeyondLastLine: false,
            language: 'css'
        });

        panel.current.onDidChangeModelContent(() => {
            if (onChange) {
                onChange(panel.current.getValue());
            }
        });

    }, []);

    useEffect(() => {
        if (height && panel.current) {
            panel.current.layout({ height, width });
        }
    }, [height, width, panel]);

    useEffect((): void => {
        if (panel.current) {
            panel.current.setValue(lines);
        }
    }, [lines, panel]);

    return (
        <div css={stylesheet.container}>
            <div css={stylesheet.panelHeader}>{ title }</div>
            <div css={stylesheet.panel} ref={panelContainer}>
                
            </div>
        </div>
    );
};