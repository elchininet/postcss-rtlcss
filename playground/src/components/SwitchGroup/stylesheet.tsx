import { COLORS } from '@constants';
import { parse } from '@utilities/styles';

export const stylesheet = parse({
    component: {
        position: 'relative'
    },
    container: {
        paddingTop: 10,
        display: 'flex',
        height: 30
    },
    vertical: {
        flexDirection: 'column'
    },
    label: {
        color: COLORS.gray_light,
        fontSize: 16,
        fontWeight: 300
    },
    switch: {
        backgroundColor: COLORS.gray_darkest,
        borderRight: `1px solid ${COLORS.gray_dark}`,
        color: COLORS.white,
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        flexShrink: 0,
        justifyContent: 'center',
        position: 'relative',
        label: {
            cursor: 'pointer',
            flexGrow: 1,
            fontSize: 16,
            fontWeight: 300,
            textAlign: 'center'
        },
        input: {
            opacity: 0,
            position: 'absolute',
            height: 0,
            width: 0
        },
        '&:first-of-type': {
            borderBottomLeftRadius: 15,
            borderTopLeftRadius: 15
        },
        '&:last-of-type': {
            borderRight: 'none',
            borderBottomRightRadius: 15,
            borderTopRightRadius: 15
        }
    },
    switchActive: {
        backgroundColor: COLORS.action
    }
});