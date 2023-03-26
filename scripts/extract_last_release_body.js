const fs = require('fs/promises');

const createRelease = async() => {
    const data = await fs.readFile('./CHANGELOG.md', { encoding: 'utf8' });
    const RELEASE = data.replace(/^#[^#]*?##\s.*?(\d{4}-\d{2}-\d{2}[^#]*)\n[\s\S]*$/, '$1');
    await fs.writeFile('./RELEASE.md', RELEASE);
};

createRelease();