const promises = require('fs/promises');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const { log } = require('console');

const componentsFolder = path.join(__dirname, 'components');
const template = path.join(__dirname, 'template.html');
const index = path.join(__dirname, 'project-dist', 'index.html');
const styles = path.join(__dirname, 'styles');
const styleCss = path.join(__dirname, 'project-dist', 'style.css');
const assetsOld = path.join(__dirname, 'assets');
const assetsNew = path.join(__dirname, 'project-dist', 'assets');


async function makeYndexHtml() {
    try {

        const rm = await fs.promises.rm(path.join(__dirname, 'project-dist'), {force: true, recursive: true });
        const projectDist = await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
        const ihdexHtml = await fs.promises.copyFile(template, index);

        const files = await fs.promises.readdir(componentsFolder, {withFileTypes: true});
        for (let i = 0; i < files.length; i++) {
            if (path.extname(files[i].name) === '.html') {

                const fileInfo = path.join(__dirname, 'components', files[i].name);
                const tag = '{{' + path.basename(fileInfo, '.html') + '}}'; 
                const readIndex = await fs.promises.readFile(index, 'utf8');
                await changeTag(fileInfo, tag, readIndex); 
            };
        } 

    } catch (error) {
        console.log(`Index.html не создан: ${error}`);
    }
}

async function changeTag(fileInfo, tag, readIndex) {
    try {

        const data = await fs.promises.readFile(fileInfo, 'utf-8');
        const replaceTag = readIndex.replace(tag, data);
        await fs.promises.writeFile(index, replaceTag);

    } catch (error) {
        console.log('Ошибка при замене тегов:' + error);
    }
}

async function makeCss () {
    try {
        const makeFile = await fs.promises.rm(styleCss, {force: true, recursive: true });
        const files = await fs.promises.readdir(styles, {withFileTypes: true});
        for (let j = 0; j < files.length; j++) {
            if (path.extname(files[j].name) === '.css') {
                readStr(files[j]);
            }
        };

    } catch (error) {
        console.log('Ошибка при создании style.css:' + error);
    }
}

async function readStr(filecss) {
    try {
        const fileText = path.join(styles, filecss.name);
        const readStream = fs.createReadStream(fileText, 'utf-8');
        let data = '\n';
        readStream.on('data', chunk => data += chunk);
        readStream.on('end', () => {
            textBundler(styleCss, data);
        });
    } catch (error) {
       
    }
};

async function textBundler(dir, data) {
    try {
        const textFile = await fs.promises.appendFile(dir, data);
    } catch (error) {
        console.log('Ошибка при добавлении стилей в style.css:' + error);
    }
    
};

async function makeAssets () {
    try {
        const rm = await fs.promises.rm(assetsNew, {force: true, recursive: true });
        const newAssets = await fs.promises.mkdir(assetsNew, { recursive: true });
        copyAssets (assetsOld, assetsNew);
    } catch (error) {
        console.log('Ошибка при копировании файлов assets:' + error);
    }

    
}

async function copyAssets (from, to) {
    try {
        const readAssets = await fs.promises.readdir(from, {withFileTypes: true});
        for (let file of readAssets) {
            if (file.isDirectory()) {
                await fs.promises.mkdir(path.join(to, file.name), { recursive: true });
                await copyAssets (path.join(from, file.name), (path.join(to, file.name)));
            } else if (file.isFile()) {
                fs.copyFile(path.join(from, file.name), (path.join(to, file.name)), (err) => {
                    if (err) throw err;
                });
            }
        }
    } catch (error) {
        console.log('Ошибка при копировании файлов assets:' + error);
    }
}


(async () => {
    await makeYndexHtml();
    makeCss();
    makeAssets();
})()