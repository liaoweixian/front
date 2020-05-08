import request from '@/utils/request'
import requestPost from '@/utils/requestPost'
const querystring = require('querystring')


export function getShipmentLable(params) {
  return request({
    url: 'api/HwTaskDetail',
    method: 'get',
    params
  })
}

export function addAllShipments(data) {
  return request({
    url: 'api/HwTaskDetail/excel',
    method: 'post',
    data
  })
}

export function artificial(params) {
  return requestPost({
    url: 'api/HwTaskDetail/artificial',
    method: 'post',
    data: querystring.stringify(params)
  })
}
export function add(data) {
  return request({
    url: 'api/HwTaskDetail',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/HwTaskDetail/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/HwTaskDetail',
    method: 'put',
    data
  })
}

export default { add, edit, del,artificial,addAllShipments,getShipmentLable }
