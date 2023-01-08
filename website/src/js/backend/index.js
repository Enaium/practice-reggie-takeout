/*
 * Copyright © 2023 Enaium <enaium@outlook.com>
 *
 * This work is free. You can redistribute it and/or modify it under the
 * terms of the Do What The Fuck You Want To Public License, Version 2,
 * as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
 */

/* 自定义trim */
export const trim = str => {  //删除左右两端的空格,自定义的trim()方法
    return str === undefined ? "" : str.replace(/(^\s*)|(\s*$)/g, "")
};

//获取url地址上面的参数
export const requestUrlParam = argname => {
    const url = location.href; //获取完整的请求url路径
    const arrStr = url.substring(url.indexOf("?") + 1).split("&");
    for (let i = 0; i < arrStr.length; i++) {
        const loc = arrStr[i].indexOf(argname + "=");
        if (loc !== -1) {
            return arrStr[i].replace(argname + "=", "").replace("?", "")
        }
    }
    return ""
};
