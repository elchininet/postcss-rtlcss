import React, { useEffect } from 'react';
import { Mode, Source, Autorename } from 'postcss-rtlcss/options';
import { useAppContext } from '@components/AppProvider';
import { Switch } from '@components/Switch';
import { SwitchGroup } from '@components/SwitchGroup';
import { isBoolean } from '@utilities/types';
import styles from './Options.module.scss';

export const Options = (): JSX.Element => {

    const {
        setOptions,
        optionsOpen,
        changeOptionsMode,
        changeOptionsSource,
        changeOptionsSafeBothPrefix,
        changeOptionsIgnorePrefixedRules,
        changeOptionsProcessUrls,
        changeOptionsProcessKeyframes,
        changeOptionsProcessEnv,
        changeOptionsUseCalc,
        changeOptionsAutoRename,
        changeOptionsGreedy,
        fetchOptions
    } = useAppContext();

    const changeMode = (value: string): void => {
        if (value === 'combined') {
            changeOptionsMode(Mode.combined);
        } else if (value === 'override') {
            changeOptionsMode(Mode.override);
        } else {
            changeOptionsMode(Mode.diff);
        }
    };
    const changeSource = (checked: boolean): void => changeOptionsSource(checked ? Source.rtl : Source.ltr);
    const changeSafeBothPrefix = (checked: boolean) => changeOptionsSafeBothPrefix(checked);
    const changeIgnorePrefixedRules = (checked: boolean) => changeOptionsIgnorePrefixedRules(checked);
    const changeProcessUrls = (checked: boolean): void => changeOptionsProcessUrls(checked);
    const changeProcessKeyframes = (checked: boolean): void => changeOptionsProcessKeyframes(checked);
    const changeProcessEnv = (checked: boolean): void => changeOptionsProcessEnv(checked);
    const changeUseCalc = (checked: boolean): void => changeOptionsUseCalc(checked);
    const changeAutoRename = (value: string): void => {
        if (value === 'disabled') {
            changeOptionsAutoRename(Autorename.disabled);
        } else if (value === 'flexible') {
            changeOptionsAutoRename(Autorename.flexible);
        } else {
            changeOptionsAutoRename(Autorename.strict);
        }
    };
    const changeGreedy = (checked: boolean): void => changeOptionsGreedy(checked);

    useEffect(() => {
        if (fetchOptions) {
            setOptions(fetchOptions);
        }
    }, [fetchOptions]);
    
    return (
        <div className={styles.wrapper} data-opened={optionsOpen}>
            <div className={styles.header}>
                Options
            </div>
            <div className={styles.container}>
                { /* Mode */ }
                <div className={styles.panel}>
                    <SwitchGroup
                        label="Mode"
                        name="mode"
                        values={['combined', 'override', 'diff']}
                        onChange={changeMode}
                        active={ fetchOptions?.mode as string ||  'combined'}
                    />
                </div>
                { /* Source */ }
                <div className={styles.panel}>
                    <Switch
                        labels={['source: ltr', 'source: rtl']}
                        onChange={changeSource}
                        attributes={{
                            checked: fetchOptions?.source === 'rtl'
                        }}
                    />
                </div>
                { /* safeBothPrefix */ }
                <div className={styles.panel}>
                    <Switch
                        labels={['safeBothPrefix: false', 'safeBothPrefix: true']}
                        onChange={changeSafeBothPrefix}
                        attributes={{
                            checked: !!fetchOptions?.safeBothPrefix
                        }}
                    />
                </div>
                { /* ignorePrefixedRules */ }
                <div className={styles.panel}>
                    <Switch
                        labels={['ignorePrefixedRules: false', 'ignorePrefixedRules: true']}
                        onChange={changeIgnorePrefixedRules}
                        attributes={{
                            checked: !!(
                                isBoolean(fetchOptions?.ignorePrefixedRules)
                                    ? fetchOptions.ignorePrefixedRules
                                    : true
                            )
                        }}                        
                    />
                </div>
                { /* processUrls */ }
                <div className={styles.panel}>
                    <Switch
                        labels={['processUrls: false', 'processUrls: true']}
                        onChange={changeProcessUrls}
                        attributes={{
                            checked: !!fetchOptions?.processUrls
                        }}
                    />
                </div>
                { /* processKeyFrames */ }
                <div className={styles.panel}>
                    <Switch
                        labels={['processKeyFrames: false', 'processKeyFrames: true']}                        
                        onChange={changeProcessKeyframes}
                        attributes={{
                            checked: !!fetchOptions?.processKeyFrames
                        }}
                    />
                </div>
                { /* processEnv */ }
                <div className={styles.panel}>
                    <Switch
                        labels={['processEnv: false', 'processEnv: true']}
                        onChange={changeProcessEnv}
                        attributes={{
                            checked: !!(
                                isBoolean(fetchOptions?.processEnv)
                                    ? fetchOptions.processEnv
                                    : true
                            )
                        }}
                    />
                </div>
                { /* useCalc */ }
                <div className={styles.panel}>
                    <Switch
                        labels={['useCalc: false', 'useCalc: true']}
                        onChange={changeUseCalc}
                        attributes={{
                            checked: !!fetchOptions?.useCalc
                        }}
                    />
                </div>
                { /* autoRename */ }
                <div className={styles.panel}>
                    <SwitchGroup
                        label="autoRename"
                        name="auto-rename"
                        values={['disabled', 'flexible', 'strict']}
                        onChange={changeAutoRename}
                        active={fetchOptions?.autoRename as string || 'disabled'}
                    />
                </div>
                { /* greedy */ }
                <div className={styles.panel}>
                    <Switch
                        labels={['greedy: false', 'greedy: true']}
                        onChange={changeGreedy}
                        attributes={{
                            checked: !!fetchOptions?.greedy
                        }}
                    />
                </div>
            </div>
        </div>
    );
};