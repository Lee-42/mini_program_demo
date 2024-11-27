// 引入调用外设的API
import getIdCardInfo from "./getIdCardInfo";
import getICCardInfo from "./getICCardInfo";
import getMSCardInfo from "./getMSCardInfo"
import getPassword from "./getPassword";
import getFingerFeatures from "./getFingerFeatures";
import getCamera from "./getCamera";
// 整合所有的API到设备工具类中
const NTDevUtils = {
    getICCardInfo,//获取IC卡信息
    getIdCardInfo, //获取身份证件信息
    getPassword, //获取密码
    getFingerFeatures, //获取指纹信息
    getMSCardInfo, //获取磁条卡信息
    getCamera, // 获取高拍仪api
}

export default NTDevUtils;