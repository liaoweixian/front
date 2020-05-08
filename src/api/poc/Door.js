import request from '@/utils/request'

export function getDoors(params) {
  return request({
    url: 'api/Door',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/Door',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/Door/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/Door',
    method: 'put',
    data
  })
}

export default { add, edit, del }
