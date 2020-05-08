import request from '@/utils/request'


export function getDevices(params) {
  return request({
    url: 'api/Device',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/Device',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/Device/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/Device',
    method: 'put',
    data
  })
}
export function antStautsChange(data) {
  return request({
    url: 'api/Device',
    method: 'put',
    data
  })
}

export default { add, edit, del }
