import request from "@/js/backend/request.js";


// 查询列表页接口
const getOrderDetailPage = (params) => {
  return request({
    url: '/order/page',
    method: 'get',
    params
  })
}

// 查看接口
const queryOrderDetailById = (id) => {
  return request({
    url: `/orderDetail/${id}`,
    method: 'get'
  })
}

// 取消，派送，完成接口
const editOrderDetail = (params) => {
  return request({
    url: '/order',
    method: 'put',
    data: { ...params }
  })
}
