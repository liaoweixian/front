import request from '@/utils/request'

export function getApplicatons(params) {
  return request({
    url: 'api/HwAppInfo',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/HwAppInfo',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/HwAppInfo/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/HwAppInfo',
    method: 'put',
    data
  })
}

export default { add, edit, del }
