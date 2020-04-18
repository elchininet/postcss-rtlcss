import { COLORS } from '@constants';
import { parse, shorthands } from '@utilities/styles';

export const stylesheet = parse({
    wrapper: {
        alignItems: 'center',
        backgroundColor: COLORS.gray_darkest,
        flexGrow: 0,
        flexShrink: 0,
        height: 50,
        lineHeight: '50px',
        padding: shorthands(0, 10, 0, 50),
        '& span': {
            color: COLORS.action,
            fontSize: [18, 20],
            fontWeight: 400
        }
    },
    title: {
        color: COLORS.gray_light,
        display: 'inline',
        fontSize: [14, 16],
        fontWeight: 700,
        margin: 0
    }
});