const { resolve, basename } = require('path');
const { isFile, readDir } = require('./utils');
const { MDFileTransformer } = require('./transformer');

function getDirTree(dir, conf = {}) {
    console.log('当前文件夹: ', dir);
    const _path = resolve(__dirname, dir);
    const _name = basename(_path);

    // 当前dir为md文件
    // 解析文件标题，直接导出
    if (isFile(_path) && _name.endsWith('.md')) {
        return {
            title: _name.replace('.md', ''),
            children: MDFileTransformer(_path, conf)
        };
    }

    // 当前为文件夹
    // 获取所有文件
    const files = readDir(_path);
    // 递归解析文件夹内每个文件内容
    return {
        title: _name,
        children: files.map(file => getDirTree(dir + '/' + file))
    };
}

module.exports = {
    getDirTree
}