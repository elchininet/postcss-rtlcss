import React, { useEffect } from 'react';
import { Mode, Source, Autorename } from 'postcss-rtlcss/options';
import { useAppContext } from '@components/AppProvider';
import { Switch } from '@components/Switch';
import { SwitchGroup } from '@components/SwitchGroup';
import { stylesheet } from './stylesheet';
import { isBoolean } from '@utilities/types';

export const Options = (): JSX.Element => {

    const {
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
            changeOptionsAutoRename(Autorename.disabled)
        } else if (value === 'flexible') {
            changeOptionsAutoRename(Autorename.flexible);
        } else {
            changeOptionsAutoRename(Autorename.strict);
        }
    };
    const changeGreedy = (checked: boolean): void => changeOptionsGreedy(checked);

    useEffect(() => {
        if (fetchOptions) {
            if (fetchOptions.mode) {
                changeMode(fetchOptions.mode as string);
            }
            if (fetchOptions.source) {
                changeSource(fetchOptions.source === 'rtl');
            }
            if (isBoolean(fetchOptions.safeBothPrefix)) {
                changeIgnorePrefixedRules(fetchOptions.safeBothPrefix as boolean);
            }
            if (isBoolean(fetchOptions.ignorePrefixedRules)) {
                changeIgnorePrefixedRules(fetchOptions.ignorePrefixedRules as boolean);
            }
            if (isBoolean(fetchOptions.processUrls)) {
                changeProcessUrls(fetchOptions.processUrls as boolean);
            }
            if (isBoolean(fetchOptions.processKeyFrames)) {
                changeProcessKeyframes(fetchOptions.processKeyFrames as boolean);
            }
            if (isBoolean(fetchOptions.processEnv)) {
                changeProcessEnv(fetchOptions.processEnv as boolean);
            }
            if (isBoolean(fetchOptions.useCalc)) {
                changeUseCalc(fetchOptions.useCalc as boolean);
            }
            if (fetchOptions.autoRename) {
                changeAutoRename(fetchOptions.autoRename as string);
            }
            if (isBoolean(fetchOptions.greedy)) {
                changeGreedy(fetchOptions.greedy as boolean);
            }
        }
    }, [fetchOptions]);
    
    return (
        <div css={stylesheet.wrapper} data-opened={optionsOpen}>
            <div css={stylesheet.header}>
                Options
            </div>
            <div css={stylesheet.container}>
                { /* Mode */ }
                <div css={stylesheet.panel}>
                    <SwitchGroup
                        label="Mode"
                        name="mode"
                        values={['combined', 'override', 'diff']}
                        onChange={changeMode}
                        active={ fetchOptions?.mode as string ||  'combined'}
                    />
                </div>
                { /* Source */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['source: ltr', 'source: rtl']}
                        onChange={changeSource}
                        attributes={{
                            checked: fetchOptions?.source === 'rtl'
                        }}
                    />
                </div>
                { /* safeBothPrefix */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['safeBothPrefix: false', 'safeBothPrefix: true']}
                        onChange={changeSafeBothPrefix}
                        attributes={{
                            checked: !!fetchOptions?.safeBothPrefix
                        }}
                    />
                </div>
                { /* ignorePrefixedRules */ }
                <div css={stylesheet.panel}>
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
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['processUrls: false', 'processUrls: true']}
                        onChange={changeProcessUrls}
                        attributes={{
                            checked: !!fetchOptions?.processUrls
                        }}
                    />
                </div>
                { /* processKeyFrames */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['processKeyFrames: false', 'processKeyFrames: true']}                        
                        onChange={changeProcessKeyframes}
                        attributes={{
                            checked: !!fetchOptions?.processKeyFrames
                        }}
                    />
                </div>
                { /* processEnv */ }
                <div css={stylesheet.panel}>
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
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['useCalc: false', 'useCalc: true']}
                        onChange={changeUseCalc}
                        attributes={{
                            checked: !!fetchOptions?.useCalc
                        }}
                    />
                </div>
                { /* autoRename */ }
                <div css={stylesheet.panel}>
                    <SwitchGroup
                        label="autoRename"
                        name="auto-rename"
                        values={['disabled', 'flexible', 'strict']}
                        onChange={changeAutoRename}
                        active={fetchOptions?.autoRename as string || 'disabled'}
                    />
                </div>
                { /* greedy */ }
                <div css={stylesheet.panel}>
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