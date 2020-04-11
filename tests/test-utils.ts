import fs from 'fs';

export const readCSSFile = (name: string): Promise<string> => new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/css/${name}`, 'utf8', (error, data): void => {
        if (error) {
            resolve('');
        } else {
            resolve(data);
        }
    });
});