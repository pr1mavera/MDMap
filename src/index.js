const fs = require('fs');
const { resolve, basename } = require('path');

// 判断制定路径是否是文件
function isFile(dir) {
    return fs.statSync(dir).isFile();
}

// 读取路径下的文件、文件夹
function readDir(dir) {
    return fs.readdirSync(dir, (err, files) => {
        if (err) throw err;
        // console.log(`${dir}, files: `.green, files);
        // if (!files.length) console.log(`${dir}: 文件夹为空`.redBG);
        return files;
    })
}

function getDirTree(dir) {
    console.log('当前文件夹: ', dir);
    const _path = resolve(__dirname, dir);
    const _name = basename(_path);
    if (isFile(_path)) {
        return {
            title: _name
        };
    }
    const files = readDir(_path);
    return {
        title: _name,
        children: files.map(file => getDirTree(dir + '/' + file))
    };
}

const tree = getDirTree('./md');

console.log(JSON.stringify(tree, null, 2));

// const mm = {
//     title: 'file1',
//     children: [
//         {
//             title: 'children1'
//         },
//         {
//             title: 'children2',
//             children: [
//                 {
//                     title: 'childrenchildren1'
//                 },
//                 {
//                     title: 'childrenchildren2'
//                 }
//             ]
//         }
//     ]
// }

function createNode(title, deep, childs) {
    // const container = document.createElement('div');
    // const titleNode = document.createElement(`h${deep}`);
    // titleNode.innerHTML = title;
    // container.appendChild(titleNode);
    // childs && childs.length && childs.forEach(child => container.appendChild(child));

    const html = `
        <div>
            <h${deep}>${title}</h${deep}>
            ${childs && childs.length ? childs.reduce((temp, child) => temp + child) : ''}
        </div>
    `;

    return html.replace(/[\s\n]/g, '');
}

function compiler(obj, deep = 1) {

    const { title, children } = obj;
    let childs = null;
    if (children && children.length) {
        childs = children.map(childrenObj => compiler(childrenObj, deep + 1));
    }
    return createNode(title, deep, childs);
}

const res = compiler(tree);

console.log(res)
