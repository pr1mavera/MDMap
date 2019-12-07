/**
 * 节点生成器 | html
 * 
 * @param {String} title 节点标题
 * @param {Number} deep 当前节点深度
 * @param {Array | null} childs 子节点数组
 */
function _createHTMLNode(title, deep, childs) {
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

/**
 * 递归编译树生成节点
 * 
 * @param {Object} obj 树结构
 * @param {Number} deep 递归深度
 * @example
 * tree: {
 *     title: 'file1',
 *     children: [
 *         {
 *             title: 'children1'
 *         },
 *         {
 *             title: 'children2',
 *             children: [
 *                 {
 *                     title: 'childrenchildren1'
 *                 },
 *                 {
 *                     title: 'childrenchildren2'
 *                 }
 *             ]
 *         }
 *     ]
 * }
 * 
 * nodes: 
 * <div>
 *     <h1>file1</h1>
 *     <div>
 *         <h2>children1</h2>
 *     </div>
 *     <div>
 *         <h2>children2</h2>
 *         <div>
 *             <h3>childrenchildren1</h3>
 *         </div>
 *         <div>
 *             <h3>childrenchildren2</h3>
 *         </div>
 *     </div>
 * </div>
 */
function compiler(obj, deep = 1) {

    const { title, children } = obj;

    // 递归编译子树
    let childs = null;
    if (children && children.length) {
        childs = children.map(childrenObj => compiler(childrenObj, deep + 1));
    }

    // 生成节点
    return _createHTMLNode(title, deep, childs);
}

module.exports = {
    compiler
};