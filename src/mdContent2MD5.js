const fs = require('fs');
const md5 = require('md5');

function mdContent2MD5(path) {
    // 根据路径获取md文件内容
    const content = fs.readFileSync(path, 'utf-8');
    
    return md5(content);
}

module.exports = {
    mdContent2MD5
}