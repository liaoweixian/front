import request from '@/utils/request'


export function getHelperDevices(params) {
  return request({
    url: 'api/HelperDevice',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/HelperDevice',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/HelperDevice/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/HelperDevice',
    method: 'put',
    data
  })
}

export default { add, edit, del }
