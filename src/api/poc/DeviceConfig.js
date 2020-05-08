import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: 'api/DeviceConfig',
    method: 'get',
    data
  })
}
export function add(data) {
  return request({
    url: 'api/DeviceConfig',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/DeviceConfig/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/DeviceConfig',
    method: 'put',
    data
  })
}



export default {getAll, add, edit, del }
