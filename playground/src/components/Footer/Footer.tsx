import React from 'react';
import GitHubButton from 'react-github-btn';
import { Link } from '@components/Link';
import { stylesheet } from './stylesheet';

export const Footer = (): JSX.Element => {
    return (
        <footer css={stylesheet.wrapper}>
            <div css={stylesheet.footerPanel}>
                <GitHubButton
                    href="https://github.com/elchininet/postcss-rtlcss/fork"
                    data-size="small"
                    aria-label="Fork elchininet/postcss-rtlcss on GitHub"
                    data-color-scheme="no-preference: dark; light: dark; dark: dark;"
                >
                    Fork me on Github
                </GitHubButton>
            </div>
            <div css={[stylesheet.footerPanel, stylesheet.footerPanelRight]}>
                <span>
                    Playground powered by <Link href="https://microsoft.github.io/monaco-editor/">Monaco Editor</Link>
                </span>
            </div>
        </footer>
    );
};