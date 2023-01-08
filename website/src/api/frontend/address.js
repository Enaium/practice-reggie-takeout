//获取所有地址
import request from "@/js/frontend/request.js";

export const addressListApi = () => request({
    'url': '/addressBook/list',
    'method': 'get',
});

//获取最新地址
export const addressLastUpdateApi = () => request({
    'url': '/addressBook/lastUpdate',
    'method': 'get',
});

//新增地址
export const addAddressApi = data => request({
    'url': '/addressBook',
    'method': 'post',
    data
});

//修改地址
export const updateAddressApi = data => request({
    'url': '/addressBook',
    'method': 'put',
    data
});

//删除地址
export const deleteAddressApi = params => request({
    'url': '/addressBook',
    'method': 'delete',
    params
});

//查询单个地址
export const addressFindOneApi = id => request({
    'url': `/addressBook/${id}`,
    'method': 'get',
});

//设置默认地址
export const setDefaultAddressApi = data => request({
    'url': '/addressBook/default',
    'method': 'put',
    data
});

//获取默认地址
export const getDefaultAddressApi = () => request({
    'url': `/addressBook/default`,
    'method': 'get',
});