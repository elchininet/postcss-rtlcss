import React from 'react';
import { AppProvider } from '@components/AppProvider';
import { Burger } from '@components/Burger';
import { Header } from '@components/Header';
import { Options } from '@components/Options';
import { Playground } from '@components/Playground';
import { Footer } from '@components/Footer';
import styles from './App.module.scss';

export const App = (): JSX.Element => {

    return (
        <AppProvider>
            <div className={styles.wrapper}>              
                <Header />
                <Playground />
                <Footer />                        
            </div>
            <Options />
            <Burger />
        </AppProvider> 
    );
};