import request from '@/utils/request'

export function getTagDevices(params) {
  return request({
    url: 'api/TagDevice',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/TagDevice',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/TagDevice/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/TagDevice',
    method: 'put',
    data
  })
}

export function editConfig(data) {
  return request({
    url: 'api/TagDevice',
    method: 'put',
    data
  })
}

export default { add, edit, del }
