import React, { useState, useEffect, ChangeEvent } from 'react';
import { stylesheet } from './stylesheet';

interface Attributes {
    [key: string]: string | boolean;
}

export interface SwitchGroupProps {
    label: string;
    name: string;
    values: string[];
    horizontal?: boolean;
    attributes?: Attributes;
    active?: string;
    onChange?: (value: string) => void;
}

export const SwitchGroup = (props: SwitchGroupProps): JSX.Element => {
    const {
        label,
        name,
        values,
        horizontal = true,
        attributes = {},
        active,
        onChange
    } = props;
    const [selected, setSelected] = useState(values[0]);

    useEffect(() => {
        if (active) {
            setSelected(active);
        }
    }, [active]);

    const onChangeRadio = (event: ChangeEvent<HTMLInputElement>) => {
        const currentTarget = event.currentTarget;
        const value = currentTarget.value;
        setSelected(value);
        onChange && onChange(value);
    };
    return (
        <div css={stylesheet.component}>
            <span css={stylesheet.label}>
                { label }
            </span>
            <div css={[stylesheet.container, !horizontal && stylesheet.vertica]}>
                {
                    values.map((value: string): JSX.Element => {
                        const isActive = value === selected;
                        return (
                            <div
                                key={value}
                                css={[stylesheet.switch, isActive && stylesheet.switchActive]}
                            >
                                <input
                                    id={value}
                                    type="radio"
                                    name={name}
                                    value={value}
                                    checked={isActive}
                                    onChange={onChangeRadio}
                                    {...attributes}
                                />
                                <label htmlFor={value}>{value}</label>
                            </div>
                        );
                    })
                }
            </div>            
        </div>
    );
};