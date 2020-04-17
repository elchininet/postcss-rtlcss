import React from 'react';
import { Header } from '@components/Header';
import { Playground } from '@components/Playground';
import { Footer } from '@components/Footer';
import { stylesheet } from './stylesheet';

export const App = (): JSX.Element => {
    return (
        <div css={stylesheet.wrapper}>
            <Header />
            <Playground />
            <Footer />
        </div>
    );
};