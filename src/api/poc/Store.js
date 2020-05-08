import request from '@/utils/request'

export function getStores(params) {
  return request({
    url: 'api/Store',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/Store',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/Store/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/Store',
    method: 'put',
    data
  })
}

export default { add, edit, del }
