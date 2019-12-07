const fs = require('fs');
const { resolve } = require('path');
const config = require('../MDMap.config') || {};
const { 
    getDirTree,
    compiler
} = require('../src');

const tree = getDirTree(config.input);

console.log(JSON.stringify(tree, null, 2));

const node = compiler(tree);

// console.log(node);

// 将生成的节点注入至模板
const htmlContent = fs.readFileSync(resolve(__dirname, './index.html'), 'utf-8');
const res =  htmlContent.replace('{{tree}}', node);

const distPath = resolve(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, {recursive: true});
}
fs.writeFileSync(distPath + '/index.html', res);
