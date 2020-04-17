import { COLORS } from '@constants';
import { parse, buildTransition } from '@utilities/styles';

const size = 25;

export const stylesheet = parse({
    label: {
        alignItems: 'center',
        display: 'flex',
        position: 'relative'
    },
    switch: {
        backgroundColor: COLORS.gray_darkest,
        borderRadius: size,
        cursor: 'pointer',
        height: size,
        position: 'relative',
        transition: buildTransition('background-color'),
        width: size * 2,
        zIndex: 2,
        ':before': {
            backgroundColor: COLORS.gray_dark,
            border: `2px solid ${COLORS.gray_darkest}`,
            borderRadius: size,
            boxSizing: 'border-box',
            content: '""',
            display: 'block',
            height: size,
            left: 0,
            position: 'absolute',
            top: 0,
            transition: buildTransition('background-color', 'border-color', 'transform', 'left'),
            transform: 'translateX(0)',
            width: size
        },
        '&[data-checked="true"]': {
            backgroundColor: COLORS.action,
            '&:before': {
                backgroundColor: COLORS.active,
                borderColor: COLORS.action,
                left: '100%',
                transform: 'translateX(-100%)'
            }
        }
    },
    input: {
        left: 0,
        opacity: 0,
        position: 'absolute',
        top: 0,
    },
    span: {
        color: COLORS.gray_light,
        fontSize: 16,
        fontWeight: 300,
        paddingLeft: 10
    }
});