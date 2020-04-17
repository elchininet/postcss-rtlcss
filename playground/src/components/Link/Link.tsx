import React, { PropsWithChildren } from 'react';
import { stylesheet } from './stylesheet';

export interface LinkProps  {
    href: string;
}

export const Link = (props: PropsWithChildren<LinkProps>): JSX.Element => {
    const { href, children } = props;
    return (
        <a css={stylesheet.link} href={href} target="_blank" rel="noopener noreferrer">
            { children }
        </a>
    );
};