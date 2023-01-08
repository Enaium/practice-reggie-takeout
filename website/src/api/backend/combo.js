import request from "@/js/backend/request.js";

// 查询列表数据
export const getSetmealPage = (params) =>
    request({
        url: '/setmeal/page',
        method: 'get',
        params
    })

// 删除数据接口
export const deleteSetmeal = (ids) =>
    request({
        url: '/setmeal',
        method: 'delete',
        params: {ids}
    })

// 修改数据接口
export const editSetmeal = (params) =>
    request({
        url: '/setmeal',
        method: 'put',
        data: {...params}
    })

// 新增数据接口
export const addSetmeal = (params) =>
    request({
        url: '/setmeal',
        method: 'post',
        data: {...params}
    })

// 查询详情接口
export const querySetmealById = (id) =>
    request({
        url: `/setmeal/${id}`,
        method: 'get'
    })

// 批量起售禁售
export const setmealStatusByStatus = (params) =>
    request({
        url: `/setmeal/status/${params.status}`,
        method: 'post',
        params: {ids: params.ids}
    })
