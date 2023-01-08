import request from "@/js/backend/request.js";


// 查询列表页接口
export const getOrderDetailPage = (params) =>
    request({
        url: '/order/page',
        method: 'get',
        params
    })

// 查看接口
export const queryOrderDetailById = (id) =>
    request({
        url: `/orderDetail/${id}`,
        method: 'get'
    })

// 取消，派送，完成接口
export const editOrderDetail = (params) =>
    request({
        url: '/order',
        method: 'put',
        data: {...params}
    })
