import request from "@/js/frontend/request.js";

export const loginApi = data => request({
    'url': '/user/login',
    'method': 'post',
    data
});

export const sendMsgApi = data => request({
    'url': '/user/sendMsg',
    'method': 'post',
    data
});

export const loginoutApi = () => request({
    'url': '/user/loginout',
    'method': 'post',
});

  