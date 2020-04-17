import { COLORS } from '@constants';
import { parse, shorthands } from '@utilities/styles';

export const stylesheet = parse({
    container: {
        display: 'flex',
        flexBasis: '50%',
        flexDirection: 'column',
        flexGrow: 1,
        flexShrink: 0,
        borderColor: COLORS.gray_dark,
        borderStyle: 'solid',
        borderWidth: [
            0,
            shorthands(0, 5)
        ],
        boxSizing: 'border-box',
        height: '100%'
    },
    panelHeader: {
        backgroundColor: COLORS.gray_dark,
        color: COLORS.gray_light,
        fontSize: 12,
        height: 30,
        lineHeight: '30px',
        textTransform: 'uppercase'
    },
    panel: {
        flexGrow: 1,
        flexShrink: 0
    }
});