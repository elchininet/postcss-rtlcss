import React from 'react';
import PluginOptions from 'postcss-rtlcss/options';
import { useAppContext } from '@components/AppProvider';
import { Switch } from '@components/Switch';
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

    const changeMode = (checked: boolean): void => changeOptionsMode(checked ? PluginOptions.Mode.override : PluginOptions.Mode.combined);
    const changeSource = (checked: boolean): void => changeOptionsSource(checked ? PluginOptions.Source.rtl : PluginOptions.Source.ltr);
    const changeSafeBothPrefix = (checked: boolean) => changeOptionsSafeBothPrefix(checked);
    const changeIgnorePrefixedRules = (checked: boolean) => changeOptionsIgnorePrefixedRules(checked);
    const changeProcessUrls = (checked: boolean): void => changeOptionsProcessUrls(checked);
    const changeProcessKeyframes = (checked: boolean): void => changeOptionsProcessKeyframes(checked);
    const changeProcessEnv = (checked: boolean): void => changeOptionsProcessEnv(checked);
    const changeUseCalc = (checked: boolean): void => changeOptionsUseCalc(checked);
    const changeAutoRenameDisabled = (): void => changeOptionsAutoRename(PluginOptions.Autorename.disabled);
    const changeAutoRenameFlexible = (): void => changeOptionsAutoRename(PluginOptions.Autorename.flexible);
    const changeAutoRenameStrict = (): void => changeOptionsAutoRename(PluginOptions.Autorename.strict);
    const changeGreedy = (checked: boolean): void => changeOptionsGreedy(checked);
    
    return (
        <div css={stylesheet.wrapper} data-opened={optionsOpen}>
            <div css={stylesheet.header}>
                Options
            </div>
            <div css={stylesheet.container}>
                { /* Mode */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['mode: combined', 'mode: override']}
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
                    <Switch
                        labels="autoRename: disabled"
                        checkbox={false}
                        attributes={{
                            checked: !options.autoRename || options.autoRename === PluginOptions.Autorename.disabled,
                            name: 'autoRename',
                            value: 'disabled'
                        }}
                        onChange={changeAutoRenameDisabled}
                    />
                </div>
                <div css={stylesheet.panel}>
                    <Switch
                        labels="autoRename: flexible"
                        checkbox={false}
                        attributes={{
                            checked: options.autoRename === PluginOptions.Autorename.flexible,
                            name: 'autoRename',
                            value: 'flexible'
                        }}
                        onChange={changeAutoRenameFlexible}
                    />
                </div>
                <div css={stylesheet.panel}>
                    <Switch
                        labels="autoRename: strict"
                        checkbox={false}
                        attributes={{
                            checked: options.autoRename === PluginOptions.Autorename.strict,
                            name: 'autoRename',
                            value: 'strict'
                        }}
                        onChange={changeAutoRenameStrict}
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