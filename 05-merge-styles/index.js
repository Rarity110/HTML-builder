const path = require('path');
const fs = require('fs');
const promises = require('fs/promises');
const { stderr } = require('process');

const styles = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');

async function makeCss () {
    try {
        const makeFile = await fs.promises.rm(bundle, {force: true, recursive: true });
        const files = await fs.promises.readdir(styles, {withFileTypes: true});
    
        for (let file of files) {
            if (path.extname(file.name) === '.css') {
                readStr(file);
            }
        };

    } catch (error) {
        stderr.write(`Ошибка при создании папки: ${error}`);
    }
}

async function readStr(filecss) {
    try {
        const fileText = path.join(styles, filecss.name);
        const readStream = fs.createReadStream(fileText, 'utf-8');
        let data = '';
        readStream.on('data', chunk => data += chunk);
        readStream.on('end', () => {
            textBundler(bundle, data);
        });
    } catch (error) {
        stderr.write(`Ошибка при чтении файла .css: ${error}`);
    }
};

async function textBundler(dir, data) {
    try {
        const textFile = await fs.promises.appendFile(dir, data);
    } catch (error) {
        stderr.write(`Ошибка при записи в  bundle.css: ${error}`);
    }
};

try {
    makeCss (); 
} catch (error) {
    stderr.write(`Error: ${error}`);
}