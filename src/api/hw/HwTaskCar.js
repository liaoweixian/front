import request from '@/utils/request'


export function getTaskCars(params) {
  return request({
    url: 'api/HwTaskCar',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/HwTaskCar',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/HwTaskCar/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/HwTaskCar',
    method: 'put',
    data
  })
}

export default { add, edit, del }
