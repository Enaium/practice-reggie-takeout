import request from "@/js/backend/request.js";

// 查询列表接口
export const getCategoryPage = (params) =>
    request({
        url: '/category/page',
        method: 'get',
        params
    })

// 编辑页面反查详情接口
export const queryCategoryById = (id) =>
    request({
        url: `/category/${id}`,
        method: 'get'
    })

// 删除当前列的接口
export const deleCategory = (id) =>
    request({
        url: '/category',
        method: 'delete',
        params: {id}
    })

// 修改接口
export const editCategory = (params) =>
    request({
        url: '/category',
        method: 'put',
        data: {...params}
    })

// 新增接口
export const addCategory = (params) =>
    request({
        url: '/category',
        method: 'post',
        data: {...params}
    })