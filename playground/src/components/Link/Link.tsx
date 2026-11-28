import React from 'react';
import * as styles from './Link.module.css';

export interface LinkProps  {
    href: string;
}

export const Link = (props: React.PropsWithChildren<LinkProps>): React.ReactElement => {
    const { href, children } = props;
    return (
        <a className={styles.link} href={href} target="_blank" rel="noopener noreferrer">
            { children }
        </a>
    );
};