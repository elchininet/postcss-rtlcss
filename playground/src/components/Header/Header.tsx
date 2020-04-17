import React from 'react';
import GitHubButton from 'react-github-btn';
import { stylesheet } from './stylesheet';

export const Header = (): JSX.Element => {
    return (
        <header css={stylesheet.wrapper}>
            <h1 css={stylesheet.title}>PostCSS-RTLCSS plugin Playground</h1>
            <div css={stylesheet.buttons}>
                <GitHubButton
                    href="https://github.com/elchininet/postcss-rtlcss/archive/master.zip"
                    data-icon="octicon-cloud-download"
                    data-size="small"
                    aria-label="Download elchininet/postcss-rtlcss on GitHub"
                    data-color-scheme="no-preference: dark; light: dark; dark: dark;"
                >
                    Download
                </GitHubButton>
                <GitHubButton
                    href="https://github.com/elchininet/postcss-rtlcss/fork"
                    data-icon="octicon-repo-forked"
                    data-size="small"
                    aria-label="Fork elchininet/postcss-rtlcss on GitHub"
                    data-color-scheme="no-preference: dark; light: dark; dark: dark;"
                >
                    Fork
                </GitHubButton>
                <GitHubButton
                    href="https://github.com/elchininet/postcss-rtlcss"
                    data-icon="octicon-star"
                    data-size="small"
                    aria-label="Star elchininet/postcss-rtlcss on GitHub"
                    data-color-scheme="no-preference: dark; light: dark; dark: dark;"
                >
                    Star
                </GitHubButton>
            </div>
        </header>
    );
};