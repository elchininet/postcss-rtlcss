import { COLORS } from '@constants';
import { parse, shorthands } from '@utilities/styles';

export const stylesheet = parse({
    wrapper: {
        backgroundColor: COLORS.gray_darkest,
        display: 'flex',
        flexGrow: 0,
        flexShrink: 0,
        height: 50,
        lineHeight: '50px',
        padding: shorthands(0, 10)
    },
    title: {
        color: COLORS.gray_light,
        flexGrow: 1,
        fontSize: [14, 16],
        margin: 0,
        padding: 0
    },
    buttons: {
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'flex-end',
        lineHeight: 1,
    }
});