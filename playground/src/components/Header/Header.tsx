import React, { useCallback } from 'react';
import { Share } from '@icons/Share';
import { useAppContext } from '@components/AppProvider';
import { cssLines } from '@components/Playground/css';
import styles from './Header.module.scss';

export const Header = (): JSX.Element => {
    const { canShare, token, share, code, options } = useAppContext();
    const shareCallback = useCallback(() => {
        const fetchOptions = JSON.stringify(options);
        share(code, fetchOptions);
    }, [share, code, options]);
    const showShareButton = canShare && token && code && code !== cssLines;
    return (
        <header className={styles.wrapper}>
            <div className={styles.logo}>
                <span>{ '{' }&nbsp;</span>
                <h1 className={styles.title}>PostCSS-RTLCSS online</h1>
                <span>&nbsp;{ '}' }</span>
            </div>
            <div className={styles.icons}>
                {showShareButton && (
                    <button className={styles.button} onClick={shareCallback}>
                        <Share size={20} />
                    </button>
                )}
            </div>
        </header>
    );
};