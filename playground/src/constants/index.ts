export const BOOLEAN_TYPE = 'boolean';

interface BreakpointsObject {
    small: number;      // Phones in landscape mode
    medium: number;     // Tablet devices
    large: number;      // Desktop devices
    extralarge: number; // Large desktop devices
}

export const breakpointSizes: BreakpointsObject = {
    small: 576,
    medium: 768,
    large: 992,
    extralarge: 1200
};