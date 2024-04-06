import fs from 'fs';
import { PluginOptions, Mode } from '../../src/@types';

export const readCSSFile = (name: string): Promise<string> => new Promise((resolve) => {
    fs.readFile(`${__dirname}/../css/${name}`, 'utf8', (error, data): void => {
        if (error) {
            resolve('');
        } else {
            resolve(data);
        }
    });
});

export const runTests = (options: PluginOptions, callback: (options: PluginOptions) => void): void => {
    callback({...options, mode: Mode.combined});
    callback({...options, mode: Mode.override});
    callback({...options, mode: Mode.diff});
};

export const createSnapshotFileName = (baseFileName: string, testName: string, mode: string | undefined): string => {
    const folder = './__snapshots__';
    const extension = 'snapshot';
    if (mode) {
        return `${folder}/${baseFileName}/${mode}/${testName}.${extension}`;
    }
    return `${folder}/${baseFileName}/${testName}.${extension}`;
};