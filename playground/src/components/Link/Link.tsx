import React, { PropsWithChildren } from 'react';
import styles from './Link.module.scss';

export interface LinkProps  {
    href: string;
}

export const Link = (props: PropsWithChildren<LinkProps>): JSX.Element => {
    const { href, children } = props;
    return (
        <a className={styles.link} href={href} target="_blank" rel="noopener noreferrer">
            { children }
        </a>
    );
};