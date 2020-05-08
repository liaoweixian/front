import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/rfidLocMst',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/rfidLocMst/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/rfidLocMst',
    method: 'put',
    data
  })
}

export function getAll(data) {
  return request({
    url: 'api/rfidLocMst/all',
    method: 'put',
    params: data
  })
}

export default { add, edit, del, getAll }
