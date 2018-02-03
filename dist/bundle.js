#!/usr/bin/env node
'use strict';

const check = {
    zh: (function () {
        const HanZiReg = /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FD5\uF900-\uFA6D\uFA70-\uFAD9]/;
        return val => typeof val === 'string' && HanZiReg.test(val);
    })(),
    punc: (function () {
        const PuncReg = /[,\./;:\*'\[\]\{\}\(\)\!\?（）【】“”‘’，。；：！？]/;
        return val => typeof val === 'string' && PuncReg.test(val);
    })()
};

const calcWds = str => {
    const ret = {
        zh: 0,
        punc: 0
    };
    for (let i = 0; i < str.length; i++) {
        const ch = str.charAt(i);
        const ks = Object.keys(check);
        for (let j = 0; j < ks.length; j++) {
            const k = ks[j];
            if (check[k](ch)) {
                ret[k] = ret[k] === void 0 ? 0 : ret[k] + 1;
            }
        }
    }
    return ret;
};

const ret = calcWds('你好，世界。这只是个测试。');

console.log(ret);
