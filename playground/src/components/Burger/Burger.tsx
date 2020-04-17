import React from 'react';
import { useAppContext } from '@components/AppProvider';
import { stylesheet } from './stylesheet';


export const Burger = (): JSX.Element => {
    
    const { optionsOpen, setOptionsOpen } = useAppContext();

    const onClickBurger = (): void => setOptionsOpen(!optionsOpen);

    return (
        <div css={stylesheet.container} data-opened={optionsOpen}>
            <div css={stylesheet.wrapper} onClick={onClickBurger}>
                <div css={stylesheet.burger}></div>
            </div>
        </div>
    );
};