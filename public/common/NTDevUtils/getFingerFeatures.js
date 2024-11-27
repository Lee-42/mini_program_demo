const NTDev = window.NTDev || parent.NTDev ||{}
import utils from "../../utils/utils";
/**
 * 指纹特征
 * @param {Number} nPortNo 端口号(0-USB,1-串口1,2-串口2,...)
 * @param {Number} nTimeOut 超时时间(单位:毫秒)
 * @returns 指纹特征数据
 */
// let { fingerPrint } = NTDev
// let { FPICancel, FPIDetectFinger, FPIGetDevSN, FPIGetDevVersion, FPIGetFeature, FPIGetImageBmp, FPIGetTemplate } = fingerPrint
const getFingerFeatures = ({ jsonData = { nPortNo: 1, nTimeOut: 10000 }, success, fail }) => {
    if (NTDev) {
        NTDev.fingerPrint.FPIGetFeature(...jsonData, (lpFinger, lpImage, lpImageLen) => {
            if (utils.isFunction(success)) success(lpFinger);
        })
    } else {
        if (utils.isFunction(fail)) fail("当前系统没有外设驱动");
        console.error("当前系统没有外设驱动");
    }
}

export default getFingerFeatures;