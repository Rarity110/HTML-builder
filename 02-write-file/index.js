const fs = require('fs');
const path = require('path');
const stream = require('stream');
const process = require('process');
const { stdin, stdout } = require('process');



const filePath = path.join(__dirname, 'text.txt');
fs.writeFile(filePath, '', err => {
    if (err) {
        throw err
    }
});

stdout.write('Hello, Friend! What is your name? \n');
let writeableStream = fs.createWriteStream('text.txt');

stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
        process.exit();
    } else {
        fs.appendFile(filePath, data, err => {
            if (err) {
                throw err
            }
        });
    }
});

process.on('exit', () => stdout.write('Good Bye, Friend!'));
process.on('SIGINT', () => {
    process.exit();
});
