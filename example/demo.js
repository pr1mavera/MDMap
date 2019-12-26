const fs = require('fs');
const { resolve } = require('path');
const config = require('../MDMap.config') || {};
const {
    pipe,
    logger,
    getMDConstruct,
    compiler
} = require('../src');

const node = pipe(
    getMDConstruct,
    logger(tree => JSON.stringify(tree, null, 2)),
    compiler
)(config.input);

// 将生成的节点注入至模板
const htmlContent = fs.readFileSync(resolve(__dirname, './index.html'), 'utf-8');
const res =  htmlContent.replace('{{tree}}', node);

const distPath = resolve(__dirname, '../../blog/', 'dist/assets');
console.log('🤪🤪🤪 你把我的节点生成到哪儿了？ 🤪🤪🤪', distPath);
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, {recursive: true});
}
fs.writeFileSync(distPath + '/index.html', res);
