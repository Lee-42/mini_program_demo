import api from './print.js'
import common from './index.js'

const commonApi = {}

const finish = (params, appid) => {
    nt.messageBox({
        title: "提示",
        message: '业务办理成功！是否进行打印？不进行打印将退出当前交易！',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "打印",
        cancelButtonText: "不打印",
        beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
                api.print(params, appid)
            } else {
                nt.close(
                    {
                        appid,  //当前要关闭的微应用的appid ，先去管理端获取罗
                        apptype: "1",   //写死 1 就行
                    },
                );
            }
            done()
        }
    })
}

/**
 * 根据菜单码自动查询appid并跳转
 * @param {string} tranCode 菜单码
 * @param {object} params 携带get参数
 * @param {function} onSuccess nt.jumpMiniprog  成功回调
 * @param {function} onFail common.request 失败回调、nt.jumpMiniprog 失败回调
 */
const jumpMiniprog = (tranCode, params, onSuccess = () => { }, onFail) => {
    let query = ""
    if (params) {
        query += "&params=" + JSON.stringify(params)
    }
    // appid需要从接口获取
    common.request({
        url: "getTlrMenuByTranCode",
        data: {
            tran_code: tranCode,
        },
        success: (res) => {
            const data = res.data.data.data;
            console.log(`开始跳转${data.appid}，携带参数：`, query);
            if (data && data.appid) {
                nt.jumpMiniprog({
                    business_param: `appid=${data.appid}${query}`,
                    // success: onSuccess, // NOTE success无效
                    fail: (err) => {
                        if (onFail) {
                            onFail(err);
                        } else {
                            nt.message.error("无法打开创建客户号交易");
                        }
                    },
                });
                onSuccess && onSuccess();
            }
        },
        fail: (err) => {
            if (onFail) {
                onFail(err);
            } else {
                nt.message.error("无法打开创建客户号交易");
            }
        },
    });

}

/**
 * 关闭微应用
 * @param {string} tranCode 菜单交易码
 */
const closeMiniprog = (tranCode) => {
    common.request({
        url: "getTlrMenuByTranCode",
        data: {
            tran_code: tranCode,
        },
        success: (res) => {
            const data = res.data.data.data;
            nt.close({
                appid: data.appid,
                apptype: '1',
            })
        },
        fail: console.error,
    });
}

/**
 * 获取传递给本微应用的路由参数
 * @returns 路由参数，一般是一个对象
 */
const getMiniprogRouterParams = () => {
    if (window.params) {
        try {
            return JSON.parse(window.params)
        } catch (error) {
            console.error(error);
        }
    }
}

commonApi.finish = finish
commonApi.jumpMiniprog = jumpMiniprog
commonApi.closeMiniprog = closeMiniprog
commonApi.getMiniprogRouterParams = getMiniprogRouterParams
export default commonApi