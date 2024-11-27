import request from "../../utils/request"

/**
 * 简单检查是否弱密码 
 * @param {string} pwd 密码
 * @param {string} idNo 证件号码
 * @returns 是否弱密码
 */
const samplePasswordCheck = (pwd, idNo) => {
  idNo = idNo || "";
  const simple_pwds = "000000111111222222333333444444555555666666777777888888999999789456789123456123123789147258258147147369369147258369369258";

  if (simple_pwds.includes(pwd)) {
    return true;
  }

  if ("0123456789876543210".includes(pwd)) {
    return true;
  }

  if (idNo.includes(pwd)) {
    return true;
  }

  return false;
}

/**
 * 请求接口检查弱密 
 * @param {any} param0 校验参数
 * @returns 是否弱密码
 */
const checkSimplePwdOnline = async ({
  acctNo, mblNo, identNo, verifyData1, verifyData2, pinBlock
}) => {
  try {
    const { sign } = await request.post("passwdCheck", {
      format: "01",
      acctNo,
      mblNo,
      identNo,
      verifyData1,
      verifyData2,
      pinBlock,
    })

    return sign === "1"
  } catch (error) {
    console.error("弱密检查失败：", error);
    return false
  }
}

/**
 * 弱密码校验
 * @param {boolean} encipher 是否启用密码键盘加密
 * @param {object} data 验证数据集合
 * @param {string} data.pinBlock 加密后的密码/普通密码
 * @param {string} data.identNo 证件号码
 * @param {?string} data.acctNo [可选]账号1，一般为空
 * @param {?string} data.identityCardType [可选]证件类型
 * @param {?string} data.verifyData1 [可选]账号2
 * @param {?string} data.verifyData2 [可选]非身份证的证件号码
 * @returns 是否弱密码
 */
const isSamplePassword = async (encipher, data) => {
  if (!data) {
    return false
  } else {
    if (encipher) {
      let id = data.identNo || "";
      // 身份证
      if (data.identityCardType === "1") {
        if (!id) {
          id = "000000000000000000";
        }
      } else {
        id = id.replace(/[^0-9]+/, ""); // 去除非数字
        if (!data.verifyData1) {
          data.verifyData1 = id;
        } else if (!data.verifyData2) {
          data.verifyData2 = id;
        }
        // 非身份证
        id = "000000000000000000"; // 非身份证，身份证字段固定为
      }
      return await checkSimplePwdOnline({
        acctNo: data.acctNo ? data.acctNo.padStart(12, "0") : "000000000000",
        mblNo: data.mblNo ? data.mblNo.padStart(11, "0") : "00000000000",
        identNo: id,
        verifyData1: data.verifyData1,
        verifyData2: data.verifyData2,
        pinBlock: data.pinBlock,
      })
    } else {
      // 简单（明文）弱密检查
      return samplePasswordCheck(data.pinBlock, data.identNo)
    }
  }
}

export {
  isSamplePassword,
  samplePasswordCheck,
}