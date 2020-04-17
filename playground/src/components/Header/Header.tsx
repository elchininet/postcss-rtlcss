import React from 'react';
import { stylesheet } from './stylesheet';

export const Header = (): JSX.Element => {
    return (
        <header css={stylesheet.wrapper}>
            <h1 css={stylesheet.title}>PostCSS-RTLCSS online</h1>
        </header>
    );
};