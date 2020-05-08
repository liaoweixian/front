import request from '@/utils/request'

export function getTasks(params) {
  return request({
    url: 'api/HwTask',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/HwTask',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/HwTask/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/HwTask',
    method: 'put',
    data
  })
}

export default { add, edit, del }
