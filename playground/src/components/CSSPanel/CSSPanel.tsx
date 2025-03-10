import React, {
    useEffect,
    useRef,
    JSX
} from 'react';
import { editor, languages } from 'monaco-editor';
import * as styles from './CSSPanel.module.scss';

export interface CSSPanelProps {
    title: string;
    height?: number;
    width?: number;
    lines?: string;
    readOnly?: boolean;
    isMobile?: boolean;
    onChange?: (code: string) => void;
}

export const CSSPanel = (props: CSSPanelProps): JSX.Element => {

    const { title, height, width, lines = '', readOnly = false, isMobile = false, onChange } = props;
    const panel = useRef<editor.IStandaloneCodeEditor>(null);
    const panelContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {

        languages.css.cssDefaults.setModeConfiguration({
            colors: false
        });

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
            contextmenu: !isMobile,
            selectionHighlight: !isMobile,
            stickyScroll: {
                enabled: false
            },
            hover: {
                enabled: false
            },
            scrollBeyondLastLine: false,
            language: 'scss'
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
        <div className={styles.container}>
            <div className={styles.panelHeader}>{ title }</div>
            <div className={styles.panel} ref={panelContainer}></div>
        </div>
    );
};