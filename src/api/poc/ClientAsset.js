import request from '@/utils/request'

export function addAllAsset(data) {
  return request({
    url: 'api/ClientAsset/excel',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: 'api/ClientAsset',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ClientAsset/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ClientAsset',
    method: 'put',
    data
  })
}

export default { add, edit, del }
