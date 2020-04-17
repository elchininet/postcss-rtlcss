export type NumberOrString = string | number;
export type NumberOrStringArray = NumberOrString[];

export interface ObjectProps<T> {
    [key: string]: T;
}