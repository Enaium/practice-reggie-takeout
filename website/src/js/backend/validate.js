/*
 * Copyright © 2023 Enaium <enaium@outlook.com>
 *
 * This work is free. You can redistribute it and/or modify it under the
 * terms of the Do What The Fuck You Want To Public License, Version 2,
 * as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
 */

export const isValidUsername = str => ['admin', 'editor'].indexOf(str.trim()) >= 0;

export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}

export const isCellPhone = val => {
    if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false
    } else {
        return true
    }
};

//校验账号
export const checkUserName = (rule, value, callback) => {
    if (value == "") {
        callback(new Error("请输入账号"))
    } else if (value.length > 20 || value.length < 3) {
        callback(new Error("账号长度应是3-20"))
    } else {
        callback()
    }
};

//校验姓名
export const checkName = (rule, value, callback) => {
    if (value == "") {
        callback(new Error("请输入姓名"))
    } else if (value.length > 12) {
        callback(new Error("账号长度应是1-12"))
    } else {
        callback()
    }
};

export const checkPhone = (rule, value, callback) => {
    // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
    if (value == "") {
        callback(new Error("请输入手机号"))
    } else if (!isCellPhone(value)) {//引入methods中封装的检查手机格式的方法
        callback(new Error("请输入正确的手机号!"))
    } else {
        callback()
    }
};


export const validID = (rule, value, callback) => {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (value == '') {
        callback(new Error('请输入身份证号码'))
    } else if (reg.test(value)) {
        callback()
    } else {
        callback(new Error('身份证号码不正确'))
    }
};