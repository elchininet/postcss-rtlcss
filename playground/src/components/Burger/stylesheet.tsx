import { COLORS } from '@constants';
import { parse } from '@utilities/styles';

const headerSize = 50;
const height = 14;
const width = 18;
const thick = 2;

const element = {
    backgroundColor: COLORS.white,
    height: thick,
    position: 'absolute',
    width: width,
};

const pseudoElement = {
    ...element,
    content: '""',
    display: 'block',
    transformOrigin: 'center center',
    transition: 'top .25s ease-in-out, transform .25s ease-in-out'
};

export const stylesheet = parse({
    container: {
        display: 'flex',
        alignItems: 'center',
        height: headerSize,
        justifyContent: 'center',
        left: 0,
        position: 'fixed',
        top: 0,
        width: headerSize,
        zIndex: 2
    },
    wrapper:{
        cursor: 'pointer',
        flexGrow: 0,
        flexShrink: 0,
        height,
        position: 'relative',
        width,
        '&:before': {
            ...pseudoElement,
            top: 0,
            transform: 'none',
            '[data-opened="true"] &': {
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)'
            }
        },
        '&:after': {
            ...pseudoElement,
            top: '100%',
            transform: 'translateY(-100%)',
            '[data-opened="true"] &': {
                top: '50%',
                transform: 'translateY(-50%) rotate(-45deg)'
            }
        }
    }, 
    burger: {
        ...element,
        opacity: 1,
        top: '50%',
        transform: 'translateY(-50%)',
        transition: 'opacity 0.2s ease-in-out',
        '[data-opened="true"] &': {
            opacity: 0
        }
    }
});