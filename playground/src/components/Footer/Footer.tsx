import React from 'react';
import { Link } from '@components/Link';
import { stylesheet } from './stylesheet';

export const Footer = (): JSX.Element => {
    return (
        <footer css={stylesheet.wrapper}>
            <div css={stylesheet.footerPanel}>
                <span>
                    Postcss-RTLCSS (a <Link href="https://postcss.org/">postcss</Link> plugin powered by <Link href="https://rtlcss.com/">RTLCSS</Link>) 
                </span>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <span>
                    
                </span>
            </div>
            <div css={[stylesheet.footerPanel, stylesheet.footerPanelLeft]}>
                <span>
                    Playground powered by <Link href="https://microsoft.github.io/monaco-editor/">Monaco Editor</Link>
                </span>
            </div>
        </footer>
    );
};