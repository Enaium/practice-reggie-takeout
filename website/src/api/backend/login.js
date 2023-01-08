import request from "@/js/backend/request.js";


export const loginApi = (data) =>
    request({
        'url': '/employee/login',
        'method': 'post',
        data
    })

export const logoutApi = () =>
    request({
        'url': '/employee/logout',
        'method': 'post',
    })
