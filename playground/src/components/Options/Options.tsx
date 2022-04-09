import React from 'react';
import { Mode, Source, Autorename } from 'postcss-rtlcss/options';
import { useAppContext } from '@components/AppProvider';
import { Switch } from '@components/Switch';
import { SwitchGroup } from '@components/SwitchGroup';
import { stylesheet } from './stylesheet';

export const Options = (): JSX.Element => {

    const {
        optionsOpen,
        options,
        changeOptionsMode,
        changeOptionsSource,
        changeOptionsSafeBothPrefix,
        changeOptionsIgnorePrefixedRules,
        changeOptionsProcessUrls,
        changeOptionsProcessKeyframes,
        changeOptionsProcessEnv,
        changeOptionsUseCalc,
        changeOptionsAutoRename,
        changeOptionsGreedy
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
                    />
                </div>
                { /* Source */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['source: ltr', 'source: rtl']}
                        onChange={changeSource}
                    />
                </div>
                { /* safeBothPrefix */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['safeBothPrefix: false', 'safeBothPrefix: true']}
                        onChange={changeSafeBothPrefix}
                    />
                </div>
                { /* ignorePrefixedRules */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['ignorePrefixedRules: false', 'ignorePrefixedRules: true']}
                        attributes={{ checked: true }}
                        onChange={changeIgnorePrefixedRules}
                    />
                </div>
                { /* processUrls */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['processUrls: false', 'processUrls: true']}
                        onChange={changeProcessUrls}
                    />
                </div>
                { /* processKeyFrames */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['processKeyFrames: false', 'processKeyFrames: true']}                        
                        onChange={changeProcessKeyframes}
                    />
                </div>
                { /* processEnv */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['processEnv: false', 'processEnv: true']}
                        attributes={{ checked: true }}
                        onChange={changeProcessEnv}
                    />
                </div>
                { /* useCalc */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['useCalc: false', 'useCalc: true']}
                        onChange={changeUseCalc}
                    />
                </div>
                { /* autoRename */ }
                <div css={stylesheet.panel}>
                    <SwitchGroup
                        label="autoRename"
                        name="auto-rename"
                        values={['disabled', 'flexible', 'strict']}
                        onChange={changeAutoRename}
                    />
                </div>
                { /* greedy */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['greedy: false', 'greedy: true']}
                        onChange={changeGreedy}
                    />
                </div>
            </div>
        </div>
    );
};