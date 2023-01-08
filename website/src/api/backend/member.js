import request from "@/js/backend/request.js";

export const getMemberList = params =>
    request({
        url: '/employee/page',
        method: 'get',
        params
    });

// 修改---启用禁用接口
export const enableOrDisableEmployee = params =>
    request({
        url: '/employee',
        method: 'put',
        data: {...params}
    });

// 新增---添加员工
export const addEmployee = params =>
    request({
        url: '/employee',
        method: 'post',
        data: {...params}
    });

// 修改---添加员工
export const editEmployee = params =>
    request({
        url: '/employee',
        method: 'put',
        data: {...params}
    });

// 修改页面反查详情接口
export const queryEmployeeById = id =>
    request({
        url: `/employee/${id}`,
        method: 'get'
    });