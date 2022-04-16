import { BOOLEAN_TYPE } from '@constants';

export const isBoolean = (value: unknown): boolean => typeof value === BOOLEAN_TYPE;