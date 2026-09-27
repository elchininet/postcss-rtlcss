import { BOOLEAN_TYPE } from '@constants';

export const isBoolean = (value: unknown): value is boolean => typeof value === BOOLEAN_TYPE;