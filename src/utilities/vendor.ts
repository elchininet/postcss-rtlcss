const REG = /^-\w+-/;

export const vendor = {
    unprefixed: (prop: string): string => prop.replace(REG, '')
};