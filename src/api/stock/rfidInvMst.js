import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/rfidInvMst',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/rfidInvMst/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/rfidInvMst',
    method: 'put',
    data
  })
}

export default { add, edit, del }
