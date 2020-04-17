import { COLORS } from '@constants';
import { parse, shorthands } from '@utilities/styles';

export const stylesheet = parse({
    wrapper: {
        backgroundColor: COLORS.gray_dark,
        color: COLORS.white,
        display: 'flex',
        fontSize: 12,
        flexDirection: ['column', 'row'],
        flexGrow: 0,
        flexShrink: 0,
        height: [60, 30]
    },
    footerPanel: {
        flexGrow: 1,
        lineHeight: '30px',
        padding: shorthands(0, 10),
        textAlign: ['center', 'left']
    },
    footerPanelLeft: {
        textAlign: ['center', 'right']
    }
});