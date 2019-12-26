const fs = require('fs');
const { resolve } = require('path');
const { getMDConstruct } = require('../src');

const pluginName = 'MDMapPlugin';

class MDMapPlugin {

    constructor(config) {
        if (!config.input) {
            throw new Error('[MDMapPlugin] - missing markdown file input');
        }
        this.config = {
            output: 'dist/assets',
            filename: 'MDMap.json',
            mdFileDepth: 6,
            ...(config || {})
        }
    }

    apply(compiler) {
        compiler.hooks.run.tap(pluginName, compilation => {
            const MDConstruct = getMDConstruct(this.config.input, this.config);
            const distPath = resolve(__dirname, '../', this.config.output);
            console.log('🤪🤪🤪 你把我的节点生成到哪儿了？ 🤪🤪🤪', distPath);
            if (!fs.existsSync(distPath)) {
                fs.mkdirSync(distPath, { recursive: true });
            }
            fs.writeFileSync(distPath + '/' + this.config.filename, JSON.stringify(MDConstruct));
        });
    }
}

module.exports = MDMapPlugin;