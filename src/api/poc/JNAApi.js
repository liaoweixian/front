import request from 'axios'

const querystring = require('querystring')

export function findSerials(data) {
  return request({
    url: '/api/jna/findSerials',
    method: 'get',
    data
  })
}
export function connectSerial(params) {
  return request({
    url: '/api/jna/connectSerial',
    method: 'post',
    data:querystring.stringify(params)
  })
}
export function disconnectSerial(params) {
  return request({
    url: '/api/jna/disconnectSerial',
    method: 'post',
    data:querystring.stringify(params)
  })
}
export function Qmodify(params) {
  return request({
    url: '/api/jna/Qmodify',
    method: 'post',
    data:querystring.stringify(params)
  })
}
export function QueryAdjust(params) {
  return request({
    url: '/api/jna/QueryAdjust',
    method: 'post',
    data:querystring.stringify(params)
  })
}
export function Mmodify(params) {
  return request({
    url: '/api/jna/Mmodify',
    method: 'post',
    data:querystring.stringify(params)
  })
}
export function BLFmodify(params) {
  return request({
    url: '/api/jna/BLFmodify',
    method: 'post',
    data:querystring.stringify(params)
  })
}
export function transmitChannelSelect(params) {
  return request({
    url: '/api/jna/transmitChannelSelect',
    method: 'post',
    data:querystring.stringify(params)
  })
}
export function helperAndAntSelcet(params) {
  return request({
    url: '/api/jna/helperAndAntSelcet',
    method: 'post',
    data:querystring.stringify(params)
  })
}
export function upLinkFrequencySelct(params) {
  return request({
    url: '/api/jna/upLinkFrequencySelct',
    method: 'post',
    data:querystring.stringify(params)
  })
}
export function helperTransmitPowerModify(params) {
  return request({
    url: '/api/jna/helperTransmitPowerModify',
    method: 'post',
    data:querystring.stringify(params)
  })
}
export function receiverTransmitModelSelect(params) {
  return request({
    url: '/api/jna/receiverTransmitModelSelect',
    method: 'post',
    data:querystring.stringify(params)
  })
}
export function stopTagAction(params) {
  return request({
    url: '/api/jna/stopTagAction',
    method: 'post',
    data:querystring.stringify(params)
  })
}
export function startTagAction(params) {
  return request({
    url: '/api/jna/startTagAction',
    method: 'post',
    data:querystring.stringify(params)
  })
}


