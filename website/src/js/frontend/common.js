/*
 * Copyright © 2023 Enaium <enaium@outlook.com>
 *
 * This work is free. You can redistribute it and/or modify it under the
 * terms of the Do What The Fuck You Want To Public License, Version 2,
 * as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
 */

const web_prefix = '/front';

export const imgPath = path => '/common/download?name=' + path;

//将url传参转换为数组
export const parseUrl = url => {
    // 找到url中的第一个?号
    let parse = url.substring(url.indexOf("?") + 1),
        params = parse.split("&"),
        len = params.length,
        item = [],
        param = {};

    for (let i = 0; i < len; i++) {
        item = params[i].split("=");
        param[item[0]] = item[1];
    }

    return param;
};

