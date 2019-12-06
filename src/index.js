const fs = require('fs');
const { resolve, basename } = require('path');
const _ = require('./utils');

const config = {
    input: './FE-foundation',
    output: '',
    mdFileDepth: 2,
}

function setChildInDeep(arr, child, level, base) {
    // level递减至1，说明已递归到与当前标题等级深度一致的位置
    if (level == base) {
        // 可直接添加至当前children数组的末尾并返回
        return [ ...arr, child ];
    }
    // 否则需要继续递归
    const currentObj = _.last(arr);
    currentObj.children = setChildInDeep(currentObj.children || (currentObj.children = []), child, level - 1, base);

    return arr;
}

function MDFileTransformer(path) {
    // 根据路径获取md文件内容
    const content = fs.readFileSync(path, 'utf-8');
    // 抓取所有级别的title
    const allTitles = content.match(/^(#+)\s(.*)/gm);

    // 获取title等级 | Utils
    const getTitleLevel = title => _.first(title.split(/\s/)).length;
    // 获取title内容 | Utils
    const getTitleContent = title => {
        const [ , ...titleChip ] = title.split(/\s/);
        return titleChip.join(' ');
    };

    // 根据配置中md文件标题显示深度（默认为全部显示，深度为6），过滤出有效的标题
    const titles = allTitles.filter(title => getTitleLevel(title) <= (config.mdFileDepth || 6));
    if (!titles.length) return [];
    // 将第一个标题的等级作为该md文件标题的基础等级
    const baseLevel = _.compose(getTitleLevel, _.first)(titles);

    return titles.reduce(
        (temp, tar) => setChildInDeep(temp, { title: getTitleContent(tar) }, getTitleLevel(tar), baseLevel),
        []
    );
}

function getDirTree(dir) {
    console.log('当前文件夹: ', dir);
    const _path = resolve(__dirname, dir);
    const _name = basename(_path);
    if (_.isFile(_path)) {
        return {
            title: _name.replace('.md', ''),
            children: MDFileTransformer(_path)
        };
    }
    const files = _.readDir(_path);
    return {
        title: _name,
        children: files.map(file => getDirTree(dir + '/' + file))
    };
}

const tree = getDirTree(config.input);

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
        <div style="margin-left: 50px;">
            <h${deep}>${title}</h${deep}>
            ${childs && childs.length ? childs.reduce((temp, child) => temp + child) : ''}
        </div>
    `;

    return html;
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

// console.log(resLabel);

const htmlContent = fs.readFileSync(resolve(__dirname, './index.html'), 'utf-8');
const res =  htmlContent.replace('{{tree}}', resLabel);

const distPath = resolve(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, {recursive: true});
}
fs.writeFileSync(distPath + '/index.html', res);
