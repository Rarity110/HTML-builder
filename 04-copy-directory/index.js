const path = require('path');
const promises = require('fs/promises');
const fs = require('fs');

async function copyFiles(params) {

    await fs.promises.rm(path.join(__dirname, 'files-copy'), {force: true, recursive: true });

    await fs.promises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });

    const dir = path.join(__dirname, 'files');

    const files = await fs.promises.readdir(dir, {withFileTypes: true});

    for (let file of files) {   
        
        const fileInfoOld = path.join(__dirname, 'files', file.name);
        const fileInfoNew = path.join(__dirname, 'files-copy', file.name);
        
        await fs.promises.copyFile(fileInfoOld, fileInfoNew);
    };

};



try {
    copyFiles (); 
} catch (error) {
    stderr.write(`Error: ${error}`);
}

