import React, { useState, useEffect, ChangeEvent } from 'react';
import { stylesheet } from './stylesheet';

interface Attributes {
    [key: string]: string | boolean;
}

export interface SwitchProps {
    labels: string | string[];
    checkbox?: boolean;
    attributes?: Attributes;
    onChange?: (checked: boolean) => void;
}

export const Switch = (props: SwitchProps): JSX.Element => {

    const { labels, checkbox = true, attributes = {}, onChange } = props;
    const { checked: active, ...rest } = attributes;
    const [ checked, setChecked ] = useState(!!active);
    const label = typeof labels === 'string'
        ? labels
        : checked ? labels[1] : labels[0];

    const changeCallback = (event: ChangeEvent<HTMLInputElement>): void => {
        const status = event.currentTarget.checked;
        setChecked(status);
        if (onChange) {
            onChange(status);
        }
    };

    useEffect(() => {
        setChecked(!!active);
    }, [active]);

    return (
        <label css={stylesheet.label}>
            <input
                type={checkbox ? 'checkbox' : 'radio'}
                css={stylesheet.input}
                checked={checked}
                onChange={changeCallback}
                aria-checked={checked}
                { ...rest }
            />
            <div css={stylesheet.switch} data-checked={checked}></div>
            <span css={stylesheet.span}>{ label  }</span>
        </label>
    );
};