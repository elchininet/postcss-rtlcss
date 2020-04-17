import { parse, shorthands } from '@utilities/styles';
import { COLORS } from '@constants';

export const stylesheet = parse({
    wrapper: {
        display: 'flex',
        borderColor: COLORS.gray_dark,
        borderStyle: 'solid',
        borderWidth: shorthands(0, 5),
        flexDirection: ['column', 'row'],
        flexGrow: 1,
        flexShrink: 0
    }
});