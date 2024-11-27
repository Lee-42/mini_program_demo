
import api from '../common/api'
import commonData from '../common/common'

const request = {}


// 枚举根据 commonData.SysType
const ApiSuffix = {
    [commonData.SysType.ESB]: 'esb', // esb
    [commonData.SysType.MBFE]: 'mbfe', // 核心前置
}

/**
 * @param { string } url 请求接口地址 
 * @param { object } data 业务入参 
 * @param { object } options 其他配置项 
 * @param { object } options.headers 特殊 headers 配置 
 * @param { object } options.method 请求方法（post、get） 
 * @param { object } options.type 预留不同类型请求（esb、国结、外汇等） 
 * @param { object } options.auth 控制是否调用授权方案
 * */
// const http = (url, data, headers = {}, type, method = 'POST') => {
const http = (url, data, options = {}) => {
    if (options.type) {
        url = url + ApiSuffix[options.type]
    }
    return new Promise((resolve, reject) => {
        api.request({
            url,
            data,
            method: options.method || 'POST',
            headers: options.headers || {},
            // type: options.type || '',
            auth: options.auth || false,
            pubMap: options.pubMap,
            success: res => {
                // console.log('promise-sussess', res)
                const { pubMap = {}, fileData, code, msg } = res.data.data
                const { chnlRetCd, chnlMsgInfo, retCd } = pubMap
                res.data.data.msgCode = true  // 根据 chnlRetCd 转化成true或false（可用于async await）
                res.data.data.chnlMsgInfo = chnlMsgInfo || msg || res.data.errMsg || '网络错误！'
                res.data.data.chnlRetCd = chnlRetCd || (msg == '0' ? "0000" : undefined)
                if (res.statusCode === 200 && code == '0') {
                    resolve(res.data.data)
                    return
                }
                if (res.statusCode === 200 && !chnlRetCd && fileData) {
                    resolve(res.data.data)
                    return
                }
                if (res.statusCode === 200 && chnlRetCd === '0000') {
                    resolve(res.data.data)
                    return
                }
                if (res.statusCode === 200 && retCd === 'WARN') {
                    resolve(res.data.data)
                    return
                }
                if ((res.statusCode === 200 && chnlRetCd && chnlRetCd !== '0000') || (res.statusCode === 200 && code && code != '0')) {
                    res.data.data.msgCode = false
                    reject(res.data.data || {})
                    return
                }
            },
            fail: err => {
                console.log('promise-err', err)
                if (!err) return reject({ chnlRetCd: "-1", chnlMsgInfo: "授权已取消" })
                const { response } = err
                response && (response.data.msgCode = false)
                if (!response || !response.data) return reject({ chnlRetCd: "-1", chnlMsgInfo: "系统异常", errMsg: '系统异常' })
                if (!response.data.chnlMsgInfo && response.data.errMsg) response.data.chnlMsgInfo = response.data.errMsg
                reject(response.data && response.data || { chnlRetCd: "-1", chnlMsgInfo: "系统异常", errMsg: '系统异常' })
            },

        })
    })
}

/**
 * @param { string } url 请求接口地址 
 * @param { object } data 业务入参 
 * @param { object } options 其他配置项 
 * @param { object } options.headers 特殊 headers 配置 
 * */
const download = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        api.downloadFile({
            url,
            data,
            headers: options.headers || {},
            pubMap: options.pubMap,
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            },
        })
    })
}

/**
 * @param { string } url 请求接口地址 
 * @param { object } data 业务入参 
 * @param { object } options 其他配置项 
 * @param { object } options.headers 特殊 headers 配置 
 * */
const mergeHttp = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        api.request({
            url,
            data,
            headers: options.headers || {},
            pubMap: options.pubMap,
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            },
        })
    })
}

/**
 * post 常规请求方法
 * @param { string } url 请求接口地址 
 * @param { object } data 业务入参 
 * @param { object } options 其他配置项 
 * @param { object } options.headers 特殊 headers 配置 
 * @param { object } options.method 请求方法（post、get） 
 * @param { object } options.type 预留不同类型请求（esb、国结、外汇等） 
 * @param { object } options.auth 控制是否调用授权方案
 * */
request.post = (url, data, options = {}) => http(url, data, Object.assign({}, options))

/**
 * authpost授权请求方法
 * @param { string } url 请求接口地址 
 * @param { object } data 业务入参 
 * @param { object } options 其他配置项 
 * @param { object } options.headers 特殊 headers 配置 
 * @param { object } options.method 请求方法（post、get） 
 * @param { object } options.type 预留不同类型请求（esb、国结、外汇等） 
 * @param { object } options.auth 控制是否调用授权方案
 * */
request.authpost = (url, data, options) => http(url, data, Object.assign({}, { auth: true }, options))
request.mergepost = (url, data, options) => mergeHttp(url, data, Object.assign({}, { auth: true }, options))

/**
 * download 常规请求方法
 * @param { string } url 请求接口地址 
 * @param { object } data 业务入参 
 * @param { object } options 其他配置项 
 * @param { object } options.headers 特殊 headers 配置 
 * */
request.download = (url, data, options = {}) => download(url, data, Object.assign({}, options))
export default request