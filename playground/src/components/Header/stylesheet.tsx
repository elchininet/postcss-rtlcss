import { COLORS } from '@constants';
import { parse, shorthands } from '@utilities/styles';

export const stylesheet = parse({
    wrapper: {
        alignItems: 'center',
        backgroundColor: COLORS.gray_darkest,
        display: 'flex',
        flexGrow: 0,
        flexShrink: 0,
        height: 50,
        lineHeight: '50px',
        padding: shorthands(0, 10, 0, 50)
    },
    title: {
        color: COLORS.gray_light,
        flexGrow: 1,
        fontSize: [14, 16],
        fontWeight: 700,
        margin: 0
    }
});