import React from 'react';
import GitHubButton from 'react-github-btn';
import classnames from 'classnames';
import { Link } from '@components/Link';
import * as styles from './Footer.module.scss';

export const Footer = (): JSX.Element => {
    return (
        <footer className={styles.wrapper}>
            <div className={styles.footerPanel}>
                <GitHubButton
                    href="https://github.com/elchininet/postcss-rtlcss/fork"
                    data-size="small"
                    aria-label="Fork elchininet/postcss-rtlcss on GitHub"
                    data-color-scheme="no-preference: dark; light: dark; dark: dark;"
                >
                    Fork me on Github
                </GitHubButton>
            </div>
            <div className={classnames(styles.footerPanel, styles.footerPanelRight)}>
                <span>
                    Playground powered by <Link href="https://microsoft.github.io/monaco-editor/">Monaco Editor</Link>
                </span>
            </div>
        </footer>
    );
};