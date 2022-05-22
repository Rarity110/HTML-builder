const fs = require('fs');
const path = require('path');
const stream = require('stream');
const { stderr, stdout } = require('process');

const textdir = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(textdir, 'utf-8');
let data = '';
readStream.on('data', chunk => data += chunk);
readStream.on('end', () => stdout.write(data));
readStream.on('error', error => stderr._write('Error', error.message));