/*
 * Copyright © 2023 Enaium <enaium@outlook.com>
 *
 * This work is free. You can redistribute it and/or modify it under the
 * terms of the Do What The Fuck You Want To Public License, Version 2,
 * as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
 */

//获取所有的菜品分类
import request from "@/js/frontend/request.js";

export const categoryListApi = () => request({
    'url': '/category/list',
    'method': 'get',
});

//获取菜品分类对应的菜品
export const dishListApi = data => request({
    'url': '/dish/list',
    'method': 'get',
    params: {...data}
});

//获取菜品分类对应的套餐
export const setmealListApi = data => request({
    'url': '/setmeal/list',
    'method': 'get',
    params: {...data}
});

//获取购物车内商品的集合
export const cartListApi = data => request({
    'url': '/shoppingCart/list',
    //'url': '/front/cartData.json',
    'method': 'get',
    params: {...data}
});

//购物车中添加商品
export const addCartApi = data => request({
    'url': '/shoppingCart/add',
    'method': 'post',
    data
});

//购物车中修改商品
export const updateCartApi = data => request({
    'url': '/shoppingCart/sub',
    'method': 'post',
    data
});

//删除购物车的商品
export const clearCartApi = () => request({
    'url': '/shoppingCart/clean',
    'method': 'delete',
});

//获取套餐的全部菜品
export const setMealDishDetailsApi = id => request({
    'url': `/setmeal/dish/${id}`,
    'method': 'get',
});


