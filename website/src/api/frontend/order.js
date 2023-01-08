/*
 * Copyright © 2023 Enaium <enaium@outlook.com>
 *
 * This work is free. You can redistribute it and/or modify it under the
 * terms of the Do What The Fuck You Want To Public License, Version 2,
 * as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
 */

//提交订单
import request from "@/js/frontend/request.js";

export const addOrderApi = data => request({
    'url': '/order/submit',
    'method': 'post',
    data
});

//查询所有订单
export const orderListApi = () => request({
    'url': '/order/list',
    'method': 'get',
});

//分页查询订单
export const orderPagingApi = data => request({
    'url': '/order/userPage',
    'method': 'get',
    params: {...data}
});

//再来一单
export const orderAgainApi = data => request({
    'url': '/order/again',
    'method': 'post',
    data
});