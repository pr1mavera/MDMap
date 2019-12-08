const fs = require('fs');

// 判断制定路径是否是文件
const isFile = dir => fs.statSync(dir).isFile();

// 读取路径下的文件、文件夹
const readDir = dir => fs.readdirSync(dir, (err, files) => {
    if (err) throw err;
    // console.log(`${dir}, files: `.green, files);
    // if (!files.length) console.log(`${dir}: 文件夹为空`.redBG);
    return files;
});

const id = x => x;

const first = arr => arr[0] || null;

const last = arr => arr.length ? arr[arr.length - 1] : null;

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

const pipe = (...fns) => compose(...fns.reverse());

const logger = (formater = id) => chain => {
    console.log(formater(chain));
    return chain;
}

module.exports = {
    isFile,
    readDir,
    first,
    last,
    compose,
    pipe,
    logger
}