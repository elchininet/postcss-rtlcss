import React from 'react';
import { Mode, Source } from 'postcss-rtlcss';
import { useAppContext } from '@components/AppProvider';
import { Switch } from '@components/Switch';
import { stylesheet } from './stylesheet';

export const Options = (): JSX.Element => {

    const {
        optionsOpen,
        changeOptionsMode,
        changeOptionsSource,
        changeOptionsProcessUrls,
        changeOptionsProcessKeyframes,
        changeOptionsUseCalc
    } = useAppContext();

    const changeMode = (checked: boolean): void => changeOptionsMode(checked ? Mode.override : Mode.combined);
    const changeSource = (checked: boolean): void => changeOptionsSource(checked ? Source.rtl : Source.ltr);
    const changeProcessUrls = (checked: boolean): void => changeOptionsProcessUrls(checked);
    const changeProcessKeyframes = (checked: boolean): void => changeOptionsProcessKeyframes(checked);
    const changeUseCalc = (checked: boolean): void => changeOptionsUseCalc(checked);
    
    return (
        <div css={stylesheet.wrapper} data-opened={optionsOpen}>
            <div css={stylesheet.header}>
                Options
            </div>
            <div css={stylesheet.container}>
                { /* Mode */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['Mode: combined', 'Mode: override']}
                        onChange={changeMode}
                    />
                </div>
                { /* Source */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['Source: ltr', 'Source: rtl']}
                        onChange={changeSource}
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
                { /* useCalc */ }
                <div css={stylesheet.panel}>
                    <Switch
                        labels={['useCalc: false', 'useCalc: true']}
                        onChange={changeUseCalc}
                    />
                </div>
            </div>
        </div>
    );
};