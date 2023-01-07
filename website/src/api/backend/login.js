import request from "@/js/backend/request.js";


export function loginApi(data) {
  return request({
    'url': '/employee/login',
    'method': 'post',
    data
  })
}

export function logoutApi(){
  return request({
    'url': '/employee/logout',
    'method': 'post',
  })
}
