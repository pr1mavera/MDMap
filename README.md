MarkMap

+ 动机
    + 市面上
        + markmap - 565 stars - svg(d3)
        + kityminder（百度脑图） - 717 stars - svg(d3)
        + markdown-to-mindmap - 13 stars
    + 缺陷
        + 均不能将多文件目录合并生成脑图
        + 对 ts 支持不好

+ 编译流程
    + 阶段一：获取完整 tree
        1. 根据 配置文件 拿到 入口md文件目录 、 单个md目录深度 、 输出文件目录
        2. md文件目录，生成文件目录 js tree1 （MDFileTransformer）
        3. 单个md目录，根据深度，生成文件目录 js tree2 （getDirTree）
        4. js tree2 拼接至 js tree1 对应目录下，得到完整 tree 
    + 阶段二：根据完整 tree ，生成代码
        5. 根据 tree 生成 html stream（customElement），写入 输出文件目录

+ 难点
    + 设计完整 tree 数据结构，需兼容直接传入结构，及由入口文件生成结构
    + 文件递归
    + 单个md目录标题递归
    + 完整 tree 数据结构编译成可交互界面

+ 技术栈
    + typescript
    + rollup / gulp 编译相关
    + 深度优先遍历算法


1. 被动编译 MDMap.config.js script
2. 主动编译 