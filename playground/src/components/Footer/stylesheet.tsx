import { COLORS } from '@constants';
import { parse, shorthands } from '@utilities/styles';

export const stylesheet = parse({
    wrapper: {
        backgroundColor: COLORS.gray_dark,
        color: COLORS.white,
        display: 'flex',
        fontSize: 12,
        flexGrow: 0,
        flexShrink: 0,
        height: 40
    },
    footerPanel: {
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        padding: shorthands(0, 10)
    },
    footerPanelRight: {
        justifyContent: 'flex-end'
    }
});