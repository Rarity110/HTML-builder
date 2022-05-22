const readdir = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { stderr, stdout } = require('process');


const info = (file) => {
    const fileInfo = path.join(__dirname, 'secret-folder', file.name);
    fs.stat(fileInfo, (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {stdout.write(`${path.parse(fileInfo).name} - ${path.extname(fileInfo).slice(1)} - ${stats.size / 1024}kb \n`)}
    })
}

const dir = path.join(__dirname, 'secret-folder');
fs.readdir(dir, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        info(file);
    });
});
    
