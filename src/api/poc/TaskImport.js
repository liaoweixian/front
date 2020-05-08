import request from '@/utils/request'

export function addAllTask(data) {
  return request({
    url: 'api/TaskImport/excel',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: 'api/TaskImport',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/TaskImport/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/TaskImport',
    method: 'put',
    data
  })
}

export default { add, edit, del }
