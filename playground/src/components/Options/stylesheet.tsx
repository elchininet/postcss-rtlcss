import { COLORS } from '@constants';
import { parse, shorthands, buildTransition } from '@utilities/styles';

export const stylesheet = parse({
    wrapper: {
        backgroundColor: COLORS.gray_dark,
        boxShadow: '0 0 0 rgba(0, 0, 0, .5)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'fixed',
        left: 0,
        top: 0,
        transition: buildTransition('box-shadow','transform'),
        transform: 'translateX(-100%)',
        width: ['calc(100vw - 100px)', 300],
        '&[data-opened="true"]': {
            boxShadow: '5px 0 20px rgba(0, 0, 0, .5)',
            transform: 'translateX(0)'
        }
    },
    header: {
        borderBottom: `1px solid ${COLORS.gray_darkest}`,
        boxSizing: 'border-box',
        color: COLORS.gray_light,
        flexGrow: 0,
        flexShrink: 0,
        fontSize: [14, 16],
        fontWeight: 700,
        height: 50,
        lineHeight: '50px',
        opacity: 0,
        padding: shorthands(0, 20, 0, 50),
        transition: buildTransition('opacity'),
        '[data-opened="true"] &': {
            opacity: 1
        }
    },
    container: {
        flexGrow: 1,
        flexShrink: 0,
        overflowY: 'auto',
        padding: 20,
        scrollBehavior: 'smooth'
    },
    panel: {
        marginBottom: 20
    }
});