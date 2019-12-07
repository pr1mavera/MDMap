const fs = require('fs');
const _ = require('./utils');
const globalConfig = require('../MDMap.config') || {};

/**
 * 获取title等级
 * 
 * @param {String} title 等级标题
 * @example
 * _getTitleLevel('# title') -> 1
 * _getTitleLevel('### title') -> 3
 */
const _getTitleLevel = title => _.first(title.split(/\s/)).length;

/**
 * 获取title内容
 * 
 * @param {String} title 等级标题
 * @example
 * _getTitleLevel('# title1') -> title1
 * _getTitleLevel('### title3') -> title3
 */
const _getTitleContent = title => {
    const [ , ...titleChip ] = title.split(/\s/);
    return titleChip.join(' ');
};

/**
 * 根据标题等级递归插入至子节点集合
 * 
 * @param {Array} arr 子节点集合
 * @param {Object} child 待插入的子节点
 * @param {Number} level 当前递归深度
 * @param {Number} baseLv 基础等级（默认为当前md文件第一个标题等级）
 */
function _setChildInDeep(arr, child, level, baseLv) {
    // level递减至1，说明已递归到与当前标题等级深度一致的位置
    if (level == baseLv) {
        // 可直接添加至当前children数组的末尾并返回
        return [ ...arr, child ];
    }
    // 否则需要继续递归
    const curNode = _.last(arr);
    curNode.children = _setChildInDeep(curNode.children || (curNode.children = []), child, level - 1, baseLv);

    return arr;
}

/**
 * md文件标题解析器
 * 
 * @param {String} path md文件路径
 * @param {Object} conf 配置
 */
function MDFileTransformer(path, conf = {}) {
    // 合并配置
    const config = { ...globalConfig, ...conf };
    // 根据路径获取md文件内容
    const content = fs.readFileSync(path, 'utf-8');
    // 抓取所有级别的title
    const allTitles = content.match(/^(#+)\s(.*)/gm);

    // 根据配置中md文件标题显示深度（默认为全部显示，深度为6），过滤出有效的标题
    const titles = allTitles.filter(title => _getTitleLevel(title) <= (config.mdFileDepth || 6));
    if (!titles.length) return [];
    // 将第一个标题的等级作为该md文件标题的基础等级
    const baseLevel = _.compose(_getTitleLevel, _.first)(titles);

    return titles.reduce(
        (temp, tar) => _setChildInDeep(temp, { title: _getTitleContent(tar) }, _getTitleLevel(tar), baseLevel),
        []
    );
}

module.exports = {
    MDFileTransformer
}