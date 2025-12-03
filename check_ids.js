const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'quizDataV2.ts');
const content = fs.readFileSync(filePath, 'utf8');

const idRegex = /id:\s*(\d+)/g;
let match;
const ids = [];

while ((match = idRegex.exec(content)) !== null) {
    ids.push(parseInt(match[1]));
}

const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
console.log('Duplicate IDs:', duplicates);
console.log('Total IDs found:', ids.length);
console.log('IDs:', ids.sort((a, b) => a - b));
