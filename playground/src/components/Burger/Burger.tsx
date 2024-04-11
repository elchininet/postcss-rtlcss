import React from 'react';
import { useAppContext } from '@components/AppProvider';
import * as styles from './Burger.module.scss';

export const Burger = (): JSX.Element => {
    
    const { optionsOpen, setOptionsOpen } = useAppContext();

    const onClickBurger = (): void => setOptionsOpen(!optionsOpen);

    return (
        <div className={styles.container} data-opened={optionsOpen}>
            <div className={styles.wrapper} onClick={onClickBurger}>
                <div className={styles.burger}></div>
            </div>
        </div>
    );
};