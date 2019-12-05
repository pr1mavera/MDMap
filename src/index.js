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

const first = arr => arr[0] || null;

const last = arr => arr.length ? arr[arr.length - 1] : null;

function setChildInDeep(arr, child, deep, base = 1) {
    if (deep == base) {
        return [ ...arr, child ];
    }
    const currentObj = last(arr);
    currentObj.children = setChildInDeep(currentObj.children || (currentObj.children = []), child, deep - 1, base);

    return arr;
}

function parseMDMap(path) {
    const content = fs.readFileSync(path, 'utf-8');
    const baseLevel = first(first(content).split(/\s/)).length;

    const mdTree = content.match(/^(#+)\s(.*)/gm).reduce((temp, tar) => {
        const [ level, ...titleChip ] = tar.split(/\s/);
        const title = titleChip.join(' ');

        return setChildInDeep(temp, { title }, level.length, baseLevel);
    }, []);

    return mdTree;
}

function getDirTree(dir) {
    console.log('当前文件夹: ', dir);
    const _path = resolve(__dirname, dir);
    const _name = basename(_path);
    if (isFile(_path)) {
        return {
            title: _name.replace('.md', ''),
            children: parseMDMap(_path)
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

const resLabel = compiler(tree);

console.log(resLabel);

const htmlContent = fs.readFileSync(resolve(__dirname, './index.html'), 'utf-8');
const res =  htmlContent.replace('{{tree}}', resLabel);

const distPath = resolve(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, {recursive: true});
}
fs.writeFileSync(distPath + '/index.html', res);
