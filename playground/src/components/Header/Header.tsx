import React, { useCallback } from 'react';
import { Share } from '@icons/Share';
import { useAppContext } from '@components/AppProvider';
import { cssLines } from '@components/Playground/css';
import { stylesheet } from './stylesheet';

export const Header = (): JSX.Element => {
    const { canShare, token, share, code, options } = useAppContext();
    const shareCallback = useCallback(() => {
        const fetchOptions = JSON.stringify(options);
        share(code, fetchOptions);
    }, [share, code, options]);
    const showShareButton = canShare && token && code && code !== cssLines;
    return (
        <header css={stylesheet.wrapper}>
            <div css={stylesheet.logo}>
                <span>{ '{' }&nbsp;</span>
                <h1 css={stylesheet.title}>PostCSS-RTLCSS online</h1>
                <span>&nbsp;{ '}' }</span>
            </div>
            <div css={stylesheet.icons}>
                {showShareButton && (
                    <button css={stylesheet.button} onClick={shareCallback}>
                        <Share size={20} />
                    </button>
                )}
            </div>
        </header>
    );
};