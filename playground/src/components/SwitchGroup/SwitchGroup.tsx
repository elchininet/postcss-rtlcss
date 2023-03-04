import React, { useState, useEffect, ChangeEvent } from 'react';
import classnames from 'classnames';
import styles from './SwitchGroup.module.scss';

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
        <div className={styles.component}>
            <span className={styles.label}>
                { label }
            </span>
            <div className={classnames(styles.container, !horizontal && styles.vertical)}>
                {
                    values.map((value: string): JSX.Element => {
                        const isActive = value === selected;
                        return (
                            <div
                                key={value}
                                className={classnames(styles.switchElement, isActive && styles.switchActive)}
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