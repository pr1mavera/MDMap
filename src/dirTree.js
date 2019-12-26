const { resolve, basename } = require('path');
const { isFile, readDir } = require('./utils');
const { MDFileTransformer } = require('./transformer');

const { mdContent2MD5 } = require('./mdContent2MD5');

function getMDConstruct(staticDir /* 原静态资源地址 */ , conf) {

    const mdMap = {};

    const _getMDConstruct = (dir, conf = {}) => {
        console.log('当前文件夹: ', dir);
        const _path = resolve(__dirname, dir);
        const _name = basename(_path);
    
        // 当前dir为md文件
        // 解析文件标题，直接导出
        if (isFile(_path) && _name.endsWith('.md')) {
            const aid = mdContent2MD5(_path);
            const title = _name.replace('.md', '');
            const children = MDFileTransformer(_path, conf);

            // 挂载 md 文件，指定静态资源地址
            aid && (mdMap[aid] = conf.targetStaticPath
                                    ? _path.replace(staticDir, conf.targetStaticPath)
                                    : _path);

            return {
                aid,
                title,
                children
            };
        }
    
        // 当前为文件夹
        // 获取所有文件
        const files = readDir(_path);
        // 递归解析文件夹内每个文件内容
        return {
            title: _name,
            children: files.map(file => _getMDConstruct(dir + file, conf))
        };
    }

    const mdTree = _getMDConstruct(staticDir, conf);

    return { mdTree, mdMap }
}

module.exports = {
    getMDConstruct
}