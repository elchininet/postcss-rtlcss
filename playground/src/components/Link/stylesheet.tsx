import { COLORS } from '@constants';
import { parse } from '@utilities/styles';

export const stylesheet = parse({
    link: {
        color: COLORS.action,
        '&:hover': {
            color: COLORS.action,
            textDecoration: 'underline'
        },
        '&:visited': {
            color: COLORS.action
        }
    }
});