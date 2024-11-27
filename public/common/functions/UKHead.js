import GlobalVariable from '../GlobalVariable'
import UserVariable from '../UserVariable'

/**
 * 椰盾冠字号校验
 * @param {string} value 字符串
 * @param {string} type 1 - 对公 2 - 对私
 * @returns 是否校验通过
 */
const checkUKHead = (value, type = "1") => {
  const UKCrownHead = GlobalVariable.UKCrownHead
  const Reg = []
  let str = value.substring(0, 7)
  // 对公
  if (type === "1") {
    Reg.push(UKCrownHead + "9", UKCrownHead + "8", UKCrownHead + "A")
  }
  // 对私
  else if (type === "2") {
    Reg.push(UKCrownHead + "0", UKCrownHead + "1")
  }
  return Reg.some(reg => reg === str)
}

/**
 * 检查椰盾编号判断椰盾类型
 * @param {string} value 椰盾编号
 * @returns 椰盾类型
 */
const getUKType = (value) => {
  if (value) {
    if (value.length === GlobalVariable.PersonUkeyLength || value.length === GlobalVariable.EnterpriseUkeyLength) {
      const flg = value.substring(6, 7) // 第7位
      switch (flg) {
        case "1":
          return UserVariable.UKEY_TYPE_LYD;
        case "0":
          return UserVariable.UKEY_TYPE_YPD;
        case "9":
          return UserVariable.UKEY_TYPE_WYD;
        case "8":
          return UserVariable.UKEY_TYPE_YQZLD;
        case "A":
          return UserVariable.UKEY_TYPE_QYLYD;
        default:
          break;
      }
    }
  }
}

/**
 * 获取完整椰盾编号里的真实凭证号码
 * @param {string} value 椰盾编号
 * @returns 剔除冠字号后和最小位后的椰盾凭证号码
 */
const getUKNo = (value) => {
  if (typeof value === "string") {
    if (value.length === GlobalVariable.PersonUkeyLength || value.length === GlobalVariable.EnterpriseUkeyLength) {
      return value.substring(7, 15); // 第8位 至 第 15 位 共 8 位
    }
  }
  return ""
}

export {
  checkUKHead,
  getUKType,
  getUKNo,
}