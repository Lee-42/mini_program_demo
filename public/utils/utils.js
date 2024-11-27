
import request from "./request"
import api from "../common/api"
import common from "../common/common.js"
import commonApi from "../common/commonApi"
import GlobalVariable from "../common/GlobalVariable"
const { CUR_JPY, UKCrownHead, LenAccountSeqNo, MergeAccountSeqOptions } = GlobalVariable

const { cabin } = common
const baseUrl = api.baseUrl
const Paramsk042 = {
    listCd: '', // 列表编码（标识）
    splmtInf: null, // 附属信息
    bckCd: 'K042', // 备用代码（主交易代码）
    tranCd: 'K042',
    upyDstcCd: '', // 银联地区代码
    psntWrkCrdInd: '', // 农民工卡标识 0： 非农民工卡 1：农民工卡
    instIndCnlTp: null, // 发起方渠道编号
    cnlTp: null, // 渠道类型
    cnlDt: null, // 渠道日期
    cnlTm: null, // 渠道时间
    thrdptyDt: null, // 第三方日期
    thrdptySeqNo: null, // 第三方流水
}
/**
 * @summary 处理文件格式为 map
 * @param {String} data 数据
 * @return 对象
 * @example fileDataFormat(res.fileData)
 */
const fileDataFormat = (data, format = 'obj') => {
    const text = data.replace(/\n/g, '')
    const arr = text.split('|')
    const keys = getArr(arr, 0, 2)
    const vals = getArr(arr, 1, 2)
    const OBJ = {}
    keys.forEach((item, index) => {
        if (item && keys.length < 10) {
            OBJ[item] = `[${index}]${vals[index]}`
        }
        if (item && keys.length >= 10) {
            OBJ[item] = index > 9 ? `[${index}]${vals[index]}` : `[0${index}]${vals[index]}`
        }
        if (item && keys.length >= 100) {
            OBJ[item] = index > 9 ? index > 99 ? `[${index}]${vals[index]}` : `[0${index}]${vals[index]}` : `[00${index}]${vals[index]}`
        }
    })
    return OBJ
}

/**
 * 获取数组
 * @example getArr(arr, 0, 2)
 */
const getArr = (arr, index, size) => {
    const Arr = []
    for (let i = index; i < arr.length; i = i + size) {
        Arr.push(arr[i])
    }
    return Arr
}

/**
 * trimStart 去除字符串前面字符
 * @param {string} str 字符串
 * @param {string|number} num 要去除的字符
 * @returns 返回去除之后的字符串
 * @example utils.trimStart(res_k025.vchrNo, '0')
 */
const trimStart = (str, num) => {
    if (!str) return
    let arr = str.split('')
    let index = arr.findIndex(v => v != num)
    return str.substring(index)
}

/**
 * getSelectData 获取下拉框的值
 * @param { String } flg 一级标志
 * @param { String } name 赋值数组名
 * @param { Object } that this 指针
 * @param { String } splmtInf 二级请求标志 { key: "", value: "" }
 * @param { String } mainCd 主交易码必传
 * @param { String } currentData 静态数据和接口数据合并
 * @returns utils.getSelectData({ flg: common.SelectDataType.C003, name: 'selectDataCompany1', that: this, mainCd: this.data.mainCd })//获取公司类型
 */
const getSelectData = (params) => {
    const { flg, name, that, splmtInf, mainCd, empty, currentData } = params
    const initParams = JSON.parse(JSON.stringify(Paramsk042))
    initParams.listCd = flg

    if (splmtInf) {
        initParams.splmtInf = `{${splmtInf.key}|${splmtInf.value}|}`
    }
    if (mainCd) {
        initParams.mainTranCd = mainCd
    }
    return request.post('k042', initParams).then(res => {
        // TODO 数据赋值
        let data = {}
        if (res.fileData) {
            data = fileDataFormat(currentData ? currentData + res.fileData : res.fileData)
        }

        // console.log(`【${flg} 数据源】:`, data)
        if (name) {
            that.setData({
                [`${name}`]: res.fileDataList ? res.fileDataList : []
            })
        }
        if (currentData) {
            that.data[`${name}`].unshift({ label: "全部", value: "" })
        }
        return data
    }).catch(err => {
        nt.message.error(err.chnlMsgInfo)
        // console.log('【实际错误】', err)
    })
}
/**
 * getSelectData 获取下拉框的值
 * @param { String } flg 一级标志
 * @param { String } name 赋值数组名
 * @param { Object } that this 指针
 * @param { String } splmtInf 二级请求标志 { key: "", value: "" }
 * @param { String } mainCd 主交易码必传
 * @param { String } currentData 静态数据和接口数据合并
 * @returns utils.getSelectDataC({ flg: common.SelectDataType.C003, name: 'selectDataCompany1', that: this, mainCd: this.data.mainCd })//获取公司类型
 */
const getSelectDataC = (params) => {
    const { flg, name, that, splmtInf, mainCd, empty } = params
    const initParams = JSON.parse(JSON.stringify(Paramsk042))
    initParams.listCd = flg
    if (splmtInf) {
        initParams.splmtInf = `{${splmtInf.key}|${splmtInf.value}|}`
    }
    if (mainCd) {
        initParams.mainTranCd = mainCd
    }
    return request.post('k042', initParams).then(res => {
        // TODO 数据赋值
        let data = {}
        if (res.fileData) {
            data = fileDataFormat(res.fileData)
        }

        // console.log(`【${flg} 数据源】:`, data)
        if (name) {
            that.setData({
                [`${name}`]: res.fileDataList
            })
        }
        return {
            data,
            res
        }
    }).catch(err => {
        nt.message.error(err.retMsg)
        // console.log('【实际错误】', err)
    })
}

/**
* 检查字符串的开头是否以指定的字符串开头
* @params lstr 被检查的字符串
* @params sstr 指定的字符串
* @returns Boolean值
* @example utils.startWith(nacJZinfo.rcrdCrdFlg, 'Y')
*/
const startWith = (lstr, sstr) => {
    if (lstr.indexOf(sstr) === 0) {
        return true
    }
}

/**
 * 卡bin检查
 * @param {String} str 
 * @returns Boolean值
 * @example utils.checkCardBin(this.data.formData.acctNo)
 */
const checkCardBin = (str) => {
    let result
    for (let i = 0; i < cabin.length; i++) {
        if (startWith(str, cabin[i])) {
            result = true
            continue
        }
    }
    return result
}

/**
* 根据介质类型判断是否是卡类介质
* @param { String } type - 类型
* @returns Boolean
* @example utils.checkCard(res.flgCd[17])
*/
const checkCard = (type) => {
    let result = false;
    if (type == "3" || type == "4" || type == "5") {
        result = true;
    }
    return result;
}

/**
 * 检查是否需要做高风险检查
 * @param {String} 证件类型 
 * @returns Boolean值
 * @example IsNeedToCheckHighSecurity(identTp)
 */
const IsNeedToCheckHighSecurity = (CardType) => {
    let res = false
    if (CardType != "1" && CardType != "2" && CardType != "E") {
        res = true
    }
    return res
}

/**
 * 日期校验
 * @param {*} value 值
 * @param {*} type 类型
 * @returns Boolean值
 * @example utils.dateValid(value, 'begin')
 */
const dateValid = (value, type) => {
    // 当前日期
    const currentDate = new Date().getFullYear() + '' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + (new Date().getDate() + 1 < 10 ? '0' + new Date().getDate() : new Date().getDate());
    if (type == 'begin') return value < currentDate
    if (type == "end") return value > currentDate
}

/**
 * 日期格式化
 * @param {String} dateTime 日期值
 * @param {String} formatStr 日期格式化
 * @returns 格式化好的日期
 */
const formatTime = (dateTime, formatStr = 'yyyy-MM-dd hh:mm:ss') => {
    if (dateTime) {
        let date = new Date(dateTime)
        const timeSource = {
            'y': date.getFullYear().toString(), // 年
            'M': (date.getMonth() + 1).toString().padStart(2, '0'), // 月
            'd': date.getDate().toString().padStart(2, '0'), // 日
            'h': date.getHours().toString().padStart(2, '0'), // 时
            'm': date.getMinutes().toString().padStart(2, '0'), // 分
            's': date.getSeconds().toString().padStart(2, '0') // 秒
        }

        for (const key in timeSource) {
            const [ret] = new RegExp(`${key}+`).exec(formatStr) || []
            if (ret) {
                // 年可能只需展示两位
                const beginIndex = key === 'y' && ret.length === 2 ? 2 : 0
                formatStr = formatStr.replace(ret, timeSource[key].slice(beginIndex))
            }
        }
        return formatStr
    } else {
        return ''
    }
}

/**
 * 判断是否是函数
 * @param {*} obj 函数
 * @returns Boolean值
 * @example utils.isFunction(success)
 */
const isFunction = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Function]'
}

/**
* 根据枚举的 label 值获取枚举的 value
* @param { Arrery } options - 枚举数组
* @param { String } label - 需要查找的 label 值
* @returns []数组对象
* @example utils.getEnumValue(this.data.options_identTp, data.identTp)
*/
const getEnumValue = (options, label) => {
    const reale = options.find(item => item.label == label)
    return reale && reale.value || ''
}
/**
* 根据枚举的 value 值获取枚举的 label
* @param { Arrery } options - 枚举数组
* @param { String } value - 需要查找的 value 值
* @example utils.getEnumLable(this.data.getChangedBindSts,item.cmbSt)
*/
const getEnumLable = (options, value) => {
    const reale = options.find(item => item.value == value)
    return reale.label
}

/**
 * 11位手机号码校验
 * @param {string} phoneNumber 手机号
 * @returns Boolean
 * @example util.phoneValidate(value)
 */
const phoneValidate = (phoneNumber) => {
    return /^(13[0-9]|14[014-9]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
        phoneNumber
    )
}
/**
* 金额类型检查
* @param { String } amount - 金额
* @param { String } curNo - 币种编号
* @returns return { retMsg: "日元只能输入整数，请重新输入", retCd: false }
* @example utils.isAmountCheckPass(value, this.data.formData.currencyCcy)
*/
const isAmountCheckPass = (amount, curNo) => {
    if (curNo === CUR_JPY && Math.round(amount) - amount != 0) {
        return { retMsg: "日元只能输入整数，请重新输入", retCd: false }
    } else {
        return { retCd: true }
    }
}

/**
 * 检查是否是个人椰盾冠字号
 * @param {String} UkeyHead - 椰盾冠字号
 * @returns Boolean 值
 * @example CheckPersonUKHead(value.substring(0, 7))
 * */
const CheckPersonUKHead = (UkeyHead) => {
    let arr = [`${UKCrownHead}0`, `${UKCrownHead}1`]
    return arr.includes(UkeyHead);
}

/**
 * @summary 账户、序号拆分或者合并
 * @param {String} acctNo 账户
 * @param {String} acctSrlNo 序号
 * @param {Boolean} isSplit 是否拆分
 * @return 字符串或者数组
 * @example splitOrMerge({acctNo: '110110-00100', isSplit: true}) 拆分实例
 * @example splitOrMerge({acctNo: '1101100100',acctSrlNo: '102' }) 合并实例
 */
const splitOrMerge = ({ acctNo, acctSrlNo, isSplit }) => {
    let data = null

    // 拆分 成数组 
    if (isSplit) {
        data = acctNo.split("-")
        data[1] = data[1] ? data[1].replace(/^0+/, '') : ""
    } else {
        if (acctNo && acctSrlNo) {
            // 合并 成字符串
            if (acctSrlNo > 1) {
                acctSrlNo = acctSrlNo + ''
                data = acctNo + '-' + acctSrlNo.padStart(4, '0')
            } else {
                data = acctNo
            }

        } else {
            data = ""
        }
    }
    return data
}

/**
 *  @summary 调用K025接口获取账户信息
 *  @param  acctNo 账户号 0300域
 *  @param  acctSrlNo 账户序号 0340域
 *  @param  acctStFlg 账户状态标志
 *  @param  cntnDepFlg 续存标志
 *  @param { string } acctNm 用于回显户名
 *  @param  callback 回调函数
 *  @param  that this指向
 *  @param  mainTranCd 主交易码 1265域
 *  @param  isCallback 是否直接返回 callback 否则返回接口数据
 *  @returns res数据
 *  @example const res = await utils.getAcctInfo({ acctNo: value, mainCode: this.data.APIS.API_b027 }) 把res抛出去外面使用
 */
const getAcctInfo = async ({ acctNo, acctSrlNo, acctStFlg, cntnDepFlg, acctNm, callback, that, mainCode, opnAcctBnkNo, isCallback = false }) => {
    const params = {
        acctNo,
        acctSrlNo,
        cntnDepFlg,
        acctStFlg,
        mainTranCd: mainCode,
        opnAcctBnkNo
    }
    const res = await request.post('k025', params).catch(err => err)
    if (callback && !res.msgCode) return callback(false, res.chnlMsgInfo || res.errMsg)
    if (acctNm) that.data.formData[acctNm] = res.acctNm
    if (callback && isCallback) return callback(true)
    return res
};

/**
 *  @summary 调用cxcl0014接口获取账户信息
 *  @param  acctNo 账户号 0380域
 *  @param  acctNoTp 账号类型 0670域
 *  @param  cntnDepFlg 续存标志 0680域
 *  @param  acctStFlg 账户状态标志 0690域
 *  @param  hhtFlg 是否返回海惠通信息，默认不返回 0700域
 *  @param  mainCode 主交易码 1265
 *  @param  listCd 列表编码 1280 固定值0014
 *  @param  currencyCcy 账户币种 0210 
 *  @param  cashDrftFlg 账户钞汇标志 0720
 *  @param  acctChrctrstcAttr 账户性质 0630
 *  @param  callback 回调函数
 *  @param  that this指向
 *  @param  mainTranCd 主交易码
 *  @param  isCallback 是否直接返回 callback 否则返回接口数据
 *  @returns res数据
 *  @example await utils.getAcctList({ acctNo: value, acctStFlg: "1", cntnDepFlg: "", acctNoTp: "1", currencyCcy: "", mainCode: this.data.APIS.API_2205 })
 */
const getAcctList = async ({ acctNo, acctNoTp, acctStFlg, cntnDepFlg, mainCode, callback, listCd = "0014", currencyCcy = "01", cashDrftFlg, acctChrctrstcAttr, hhtFlg, isCallback = true }) => {
    const params = {
        acctNo,
        acctNoTp,
        acctStFlg,
        cntnDepFlg,
        mainTranCd: mainCode,
        listCd,
        currencyCcy,
        cashDrftFlg,
        acctChrctrstcAttr,
        hhtFlg
    }
    const res = await request.post('cxcl0014', params).catch(err => err)
    if (callback && isCallback && !res.msgCode) return callback(false, res.chnlMsgInfo || res.errMsg)
    if (callback && isCallback) return callback(true)
    return res
}

/**
 * 把接口返回的原始 fileData 解析为可用数据对象
 * @param {string} fileDataString fileData原始数据，必须符合 `Beginxxx???Endxxx` 形式
 * @param {object} param1 配置项
 * @param {string} param1.beginFlag 数据段开始标志，如 BeginPrdsetList
 * @param {string} param1.endFlag 数据段结束标志，如 EndPrdsetList
 * @param {string} param1.separator 数据分隔符，如 /r/n
 * @returns {string[][]} [[string, string, ...], ...] - 双层数组数据，第一层表示数据列，第二层为具体数据，顺序与文档一致
 * @example utils.parseFileData(fileData, { beginFlag: "BeginList", endFlag: "EndList" })
 */
const parseFileData = (fileDataString, { beginFlag, endFlag, separator = "\r\n" }) => {
    if (typeof fileDataString === "string") {
        const reg = new RegExp(`${beginFlag}(\\s|\\S)+${endFlag}`);
        const match = fileDataString.match(reg);
        if (match) {
            const arr = match[0].split(separator);
            (arr.shift(), arr.pop());
            return arr.map(
                r => r.split("|")
            )
        }
    }
    return []
}

/**
 * @summary 弹框提示信息（成功失败警告）
 * @param {string} appid 当前要关闭的微应用的appid
 * @param {string} tranCode 当前交易号
 * @param {boolean} isSuccess 是否成功
 * @param {string} remider 提示信息
 * @example utils.showInfoBox({tranCode: "010102"})
 */
const showInfoBox = async ({ appid, tranCode, isSuccess = "success", remider = '业务办理成功' }) => {
    if (tranCode) {
        const res = await utils.getTlrMenuByTranCodeMethod(tranCode)
        if (!res.msgCode) return nt.showMessagebox(res.chnlMsgInfo, "错误提示", { type: 'error' })
        appid = res.appid
    }
    nt.showMessagebox(remider, "提 示", {
        type: isSuccess,
        confirmButtonText: '关 闭',
        beforeClose: (_, __, done) => {
            if (isSuccess == 'success') {
                nt.close(
                    {
                        appid,  // 当前要关闭的微应用的appid ，先去管理端获取罗
                        apptype: "1",   //写死 1 就行
                    },
                );
            }
            done()
        }
    })
}

/**
 * 把下拉项的值转换为中文名称
 * @param {string} value 选项值
 * @param {{value, label}[]} options 下拉框候选项
 * @param {boolean} reverse 是否以label取value
 * @returns 对应的值
 * @example utils.transformLabelByValue(op.identTp, this.data.idTypeList), // 证件类型
 */
const transformLabelByValue = (value, options, reverse = false) => {
    const result = options.find(opt => reverse ? opt.label === value : opt.value === value)
    if (result) {
        return reverse ? result.value : result.label
    }
    else return ''
}

/**
 * 将二进制文件转化为base64文件
 * @param {ArrayBuffer} data 二进制文件
 * @returns 携带转换结果的Prmise对象
 * @example utils.getBase64(res.data)
 */
const getBase64 = (data) => {
    return new Promise((resolve, reject) => {
        const blob = new Blob([data], { type: "image/jpeg" })
        const reader = new FileReader()
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(error)
    })
}

/**
 * 获取凭证背景
 * @param {String} fileName 要查询的底图名称（包括文件后缀：png、jpg等）
 * @returns  base64文本
 * @example getVoucherBackground('voucher_06.jpg')
 */
const getVoucherBackground = async (fileName) => {
    //onLoad
    let res = await request.download('downLoadImages', {
        fileType: "0",
        fileName
    }).catch(err => {
        nt.showMessagebox("底图下载失败", "错误提示", { type: 'error' })
    })
    let base = await getBase64(res.data)
    return `data:image/png;${base}`
}

/**
 * 邮箱校验
 * @param {*} value 邮箱值
 * @returns Boolean值
 */
const emailValidate = async (value) => {
    if (typeof value === "string") return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)+$/.test(value)
    return true
}

/**
 * 是否为空判断
 * @param {*} value 字符串值
 * @returns 
 */
const isNullOrEmpty = (value) => {
    return value === null || value === undefined || (typeof value === "string" && value === "")
}
/**
 * @summary 针对对公一户通需求，合并账号和账户序号接口
 * @param {string} acctNo 账号
 * @param {string} acctSrlNo 账户序号
 * @param {string} mergeResult 合并结果
 * @param {string} operateType 操作类型 MergeAccountSeqOptions.Merged:合并 ，MergeAccountSeqOptions.Devided：拆分
 * @returns {object} result 返回结果  {acctNo, acctSrlNo, mergeResult}
 * @example 合并实例 utils.getMergeAccountSeq({acctNo:"111155", acctSrlNo: "296"})
 * @example 拆分实例 utils.getMergeAccountSeq({mergeResult: '180055-52',operateType: "Devided"})
 */
const getMergeAccountSeq = ({ acctNo, acctSrlNo, mergeResult, operateType = MergeAccountSeqOptions.Merged }) => {
    let result = {}
    // 合并
    if (operateType == MergeAccountSeqOptions.Merged) {

        if (acctSrlNo && /^\d+$/.test(acctSrlNo)) {
            if (acctSrlNo > 1) {
                result.mergeResult = acctNo + "-" + acctSrlNo.toString().padStart(LenAccountSeqNo, "0")
            } else {
                result.mergeResult = acctNo
            }
        } else {
            result.mergeResult = acctNo
        }
    } else {
        // 拆分
        const lists = (mergeResult && mergeResult.split("-")) || []
        if (lists.length >= 2) {
            result.acctNo = lists[0]
            result.acctSrlNo = lists[1]
        } else {
            if (lists.length >= 1) {
                result.acctNo = lists[0]
                if (isNullOrEmpty(lists[0])) {
                    result.acctSrlNo = ""
                } else {
                    result.acctSrlNo = "1"
                }
            } else {
                result.acctNo = ""
                result.acctSrlNo = ""
            }
        }
    }

    return result
}

/**
 * @summary 根据证件信息和当前日期判断是否为成年人
 * @param {string} idType 证件类型
 * @param {string} idNo 证件号码
 * @param {date} date 当前日期
 * @returns {boolean} result 
 * @example utils.isAdult({idType:"1", idNo:"511423201704110055"})
 * 
 */
const isAdult = ({ idType, idNo, date = formatTime(new Date()) }) => {
    let result = true
    if (['1', '2', 'E'].includes(idType)) {
        if (idNo && idNo.length > 14) {
            if (date.substring(0, 4) - idNo.substring(6, 10) < 18) result = false;
        }
    }
    return result
}

/**
 * @summary 返回一个新字符串
 * @param {*} acctSrlNo 序号
 * @param {*} totalWidth 结果字符串中的字符数
 * @param {*} paddingChar 填充字符
 * @returns 返回一个新字符串
 * @example padLeft("1") 序号
 */
const padLeft = (acctSrlNo, totalWidth = 4, paddingChar = "0") => {
    return acctSrlNo && acctSrlNo.padStart(totalWidth, paddingChar)
}

/**
     * @summary 查询b036对应的数据字典
     * @param {String} options 赋值的option字段属性名
     * @param {String} parmVal 参数值  0810
     * @param {String} parmTp 参数类型 0750
     * @param {String} cstTp 客户类型  0230
     * @param {String} verfPswdFlg 是否需要上核心验密  0720
     * @param {Boolean} addAll 是否加全部
     * @example utils.getB036DataList({ options: "options_TACd", parmTp: "1", that: this }) 常规获取
     */
const getB036DataList = async ({ options, parmVal, parmTp = "0", cstTp, verfPswdFlg, addAll = true, that }) => {
    const param = {
        parmTp,
        parmVal,
        cstTp,
        verfPswdFlg
    }
    const res = await request.post("b036", param, { type: common.SysType.ESB }).catch(err => err)
    if (res.fileDataList && res.fileDataList.length && addAll) addItemOfSelecteAll(res.fileDataList)
    if (res.fileDataList && options) that.setData({ [`${options}`]: res.fileDataList })

    return res.fileDataList
}

/**
 * 根据交易号返回 appid对象
 * @param {String} tranCode 交易号
 * @example const res = await utils.getTlrMenuByTranCodeMethod("010102") 
 */
const getTlrMenuByTranCodeMethod = async (tranCode) => {
    const res = await request.post("getTlrMenuByTranCodeToClient", { tran_code: tranCode }).catch(err => err)

    return res
}


/**
 * 把对象中所有的字段值都去掉空格 trim
 * @param {Object} obj 对象
 * @example utils.trimObjectValues(myObj) 
 */
const trimObjectValues = (obj) => {
    for (let key in obj) {
        if (typeof obj[key] === "string") {
            obj[key] = obj[key].trim()
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
            // 如果该字段也是一个对象，则递归处理
            trimObjectValues(obj[key])
        }
    }
}

/**
 * @summary 查询交易 表格结果数据
 * @param {*} api 接口
 * @param {*} params 入参
 * @param {*} tableData 表格数据
 * @param {*} that this指向
 * @param {*} info 提示信息
 * @param {*} ESB 是否是esb
 * @param {*} isAuth 是否用权限查询 true：不用， false：用
 * @example 示例 await utils.submitSearch({ api: this.data.APIS.API_8141, params, that: this }) 
 * @return res 数据 
 */
const submitSearch = async ({ api, params, tableData = "tableData", that, info = "没有找到符合条件的数据", ESB, isAuth }) => {
    const apiRequest = isAuth ? request.post : request.authpost
    const res = await apiRequest(api, params, ESB ? { type: common.SysType.ESB } : null).catch(err => err)
    if (!res.msgCode) return nt.showMessagebox(res.chnlMsgInfo, "提示信息", {
        type: 'error',
        confirmButtonText: '确定',
    })

    if (!res.fileDataList) {
        nt.showMessagebox(info, "提示信息", {
            type: 'info',
            confirmButtonText: '确定',
        })
        return
    }
    tableData && that.setData({ [`${tableData}`]: res.fileDataList })
    return res
}
/**
 * 转化为32位有效数字
 * @param {*} str 数值
 * @param {*} countSum 转化的数字 
 * @returns Boolean值
 * @example utils.converToint(res.totLineNum.trim())
 */
const converToint = (str, countSum = 0) => {
    const num = parseInt(str, countSum)
    if (isNaN(num)) {
        return false
    } else {
        return true
    }
}
/**
 * 转化为32位有效数字, 传入
 * @param {*} str 数字
 * @param {*} countSum 转化的数字 
 * @returns 
 */
const converToint32BitNumber = (str, countSum = 0) => {
    const num = parseInt(str, countSum)
    if (isNaN(num)) {
        return 0
    } else {
        return str & 0xFFFFFFFF
    }
}

/**
 * 组装pubMap
 * @returns pubMap对象
 * @example utils.getPubMap()
 */
const getPubMap = () => {
    const { inst_no, tlr_no, terminal_no } = JSON.parse(localStorage.getItem("userInfo")) || {};
    const tranCd = localStorage.getItem("tranCd");
    const reqFlowNo = window.reqFlowNo || window?.frameElement?.getAttribute('reqflowno');
    const { pswdKeyFlag, pswdDeviceNo } = JSON.parse(localStorage.getItem("pwdDeviceInfo")) || {}
    return {
        tranBrchNo: inst_no,
        tlrNo: tlr_no,
        tmnlNo: terminal_no,
        reqFlowNo,
        tranCd,
        pswdKeyFlag,
        pswdDeviceNo
    }
}
/**
 * @summary 检查指定机构是否为参数中心、业务处理中心或财务
 * @param {String} brno 机构
 * @returns {Boolean}
 * @example utils.checkCsBrno(common.userInfo.brnNo)
 */
const checkCsBrno = (brno) => {
    return [GlobalVariable.CS_Center, GlobalVariable.QS_Center, GlobalVariable.FIN_Center].includes(brno)
}

/**
 * @summary 检查指定机构是否为清算机构
 * @param {String} brno 机构
 * @returns {Boolean}
 * @example utils.CheckQsBrno(common.userInfo.brnNo)
 */
const CheckQsBrno = (brno) => {
    return [GlobalVariable.QS_Center].includes(brno)
}


/**
 * @summary 下拉框数组 添加【“全部”】
 * @param {Array} data 数据
 * @returns List数据 有全部
 * @example utils.addItemOfSelecteAll(res.fileDataList)
 */
const addItemOfSelecteAll = (data, value = { value: "", label: "全部" }) => {
    data.unshift(value)
    return data
}

/**
 * 把base64数据转化为blob
 * @param {string} dataurl 完整BASE64数据
 * @returns 转化后的Blob对象
 * @example util.dataURLtoBlob(this.data.idCardAvatarPath)
 */
const dataURLtoBlob = (dataurl, fileName = `file_${Date.now()}.jpg`) => {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    const theBlob = new Blob([u8arr], { type: mime });
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;

    return theBlob
}
/**
 * 月份 + 1
 * @param {*} dateStr 日期字符串 20240501
 * @returns 日期
 * @example utils.addMonth(this.data.formData.begDt)
 */
const addMonth = (dateStr) => {
    const date = new Date(
        dateStr.substring(0, 4), // 年
        dateStr.substring(4, 6) - 1, // 月
        dateStr.substring(6, 8), // 日
    )
    date.setMonth(date.getMonth() + 1)

    const year = date.getFullYear().toString().padStart(4, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return year + month + day
}
/**
 * 月份 - 1
 * @param {*} dateStr 日期字符串20240501
 * @returns 日期
 * @example minusMonth(newDateFormat)
 */
const minusMonth = (dateStr) => {
    const date = new Date(
        dateStr.substring(0, 4), // 年
        dateStr.substring(4, 6) - 1, // 月
        dateStr.substring(6, 8), // 日
    )
    date.setMonth(date.getMonth() - 1)

    const year = date.getFullYear().toString().padStart(4, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return year + month + day
}

/**
 * 转化日期格式 2024-05-01 转化 20240501
 * @param {*} dateStr 日期
 * @param {*} value 是否月份减一
 * @returns 日期
 * @example utils.convertMonth(common.userInfo.tranDate, true)
 */
const convertMonth = (dateStr, value = false) => {
    let dateArr = dateStr.split('-')
    const newDateFormat = dateArr[0] + dateArr[1] + dateArr[2]
    if (value) {
        return newDateFormat
    } else {
        return minusMonth(newDateFormat)
    }
}
/**
 * 日期转化 20240501 转化 2024-05-01
 * @param {*} num 日期
 * @param {*} value 是否返回对象
 * @returns Boolean值
 * @example utils.extractDate(anthorizationTimeBeg)
 */
const extractDate = (num, value = false) => {
    // 确保数字转字符串
    let str = num.toString().padStart(8, '0')
    let year = parseInt(str.substring(0, 4), 10)
    let month = parseInt(str.substring(4, 6), 10)
    let day = parseInt(str.substring(6, 8), 10)
    if (value) {
        return `${year}-${month}-${day}`
    } else {
        return {
            year,
            month,
            day
        }
    }
}
/**
 * 将指定的日期与指定的时间偏移量相加，处理闰年与日期溢出(年月日 可加减)
 * @param {string} starDate 日期 20240725
 * @param {number} yearsToAdd 年份
 * @param {number} monthsToAdd 月份
 * @param {number} daysToAdd 天数
 * @returns {string} 计算后的日期字符串
 * @example utils.addDate(common.userInfo.tranDate, 0, 0, this.data.otherData.C_q)
 */
const addDate = (starDate, yearsToAdd = 0, monthsToAdd = 0, daysToAdd = 0) => {
    const year = parseInt(starDate.substring(0, 4), 10)
    const month = parseInt(starDate.substring(4, 6), 10) - 1
    const day = parseInt(starDate.substring(6, 8), 10)
    // 创建
    const date = new Date(year, month, day)
    // 添加年、月、日
    date.setFullYear(date.getFullYear() + yearsToAdd)
    date.setMonth(date.getMonth() + monthsToAdd)
    date.setDate(date.getDate() + daysToAdd)
    // 获取 结果年份、月份和日期
    const resultYear = date.getFullYear()
    const resultMonth = String(date.getMonth() + 1).padStart(2, '0')
    const resultDay = String(date.getDate()).padStart(2, '0')
    return `${resultYear}${resultMonth}${resultDay}`
}
/**
 * 去除数字字符串前面的0，保留后面的0
 * @param {*} numStr 数字
 * @returns 去除数字字符串前面的0
 * @example utils.removeLeadingZeros(res_025.acctSrlNo)
 */
const removeLeadingZeros = (numStr) => {
    return numStr.replace(/^0+/, '') || 0
}

/**
 * 根据金融机构类型，判断是否可以自输客户名称
 * @param {*} FinancialType 客户名称
 * @returns Boolean值
 * @example utils.IsCustomizeCompanyName(res_018.fITp)
 */
const IsCustomizeCompanyName = (FinancialType) => {
    let result = false
    if (FinancialType != '') {
        if (FinancialType.trim() == "d01" || FinancialType.trim() == "e01" || FinancialType.trim() == "f01" || FinancialType.trim() == "d02") {
            result = true
        }
    }
    return result
}
/**
 * 汉族 转 拼音
 * @param {*} hanzi 汉字
 * @returns 拼音
 * @example utils.hanziToUpperCasePinyin(value.cstNm)
 */
const hanziToUpperCasePinyin = (hanzi) => {
    // 使用Intl.Collator
    const collator = new Intl.Collator('zh', { usage: 'sort' })
    // 将汉族字符串分割为单个字符串数组
    const hanziArray = Array.from(hanzi)
    // 得到拼音数组
    const pinyinArray = hanziArray.map(char => char.localeCompare('a', 'zh', { sensitivity: 'base' }))
    // 将拼音转大写，添加空格
    const upperCasePinyin = pinyinArray.map(index => String.fromCharCode('A'.charCodeAt(0) + index))
    // 将拼音数组连接成带有空格字符串
    const spacedPinyin = upperCasePinyin.join(' '.repeat(3))

    return spacedPinyin
}
/**
 * 将数字字符串转化为千分位方式显示
 * 1,234,167
 * @param {*} num 数字
 * @returns 转化为千分位数字
 * @example utils.formatNumber(res_029.parmVal)
 */
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 将数字字符串转化64位整数
 * @param {*} str 
 * @returns 64位整数
 * @example utils.stringToInt64(value.trim())
 */
const stringToInt64 = (str) => {
    let result = str.toString()
    if (result.length > 15) {
        result = result.slice(-16)
    }
    return result
}

/**
 *  调用验印系统：1. 判断是否需要验印 2. 不需要：弹框提示；需要：跳转至验印系统微应用
 */
const IsAcceptanc = async ({
    params = {},
    that,
    success,
    fild,
}) => {
    const res = await request.post('yanyinGetCnt', params).catch(err => err)
    const { acceptancFlg } = res
    // 不需要验证
    if (!acceptancFlg) {
        const message = "该账户已验证过证件";
        const title = "提示";
        const options = {
            type: "info",
            confirmButtonText: "确定",
        };
        nt.showMessagebox(message, title, options)
            .then(() => {
                console.log("用户点击了确认按钮");
            })
        return
    }
    // TODO 根据返回结果判断是否打开微应用或者提示 交易号需要补充
    commonApi.jumpMiniprog('', {
        params,
    },
        res => {
            // TODO 根据成功失败回调方法
            if (res) success(res)
            if (!res) fild(res)
        }
    )

}

/**
 * @summary 密码验证
 * @param {Object} param 入参
 * @returns {Object}
 *  0300	账号	    acctNo
    0440	出票日期	dwBillDt
    0580	凭证号码	vchrNo
    0670	验证标志	verfFlg
    0800	密码	    pswd
    0890	凭证类型	vchrTp
    0920	柜员号	    tlrNo
    0400	票面金额	parAmt
    0620	证件号码	identNo
    0680	证件类型	identTp
    1265	主交易码	mainTranCd - 必填
 * 
 */
const passwordVerify = async (param) => {
    const resK021Data = await request.post("k021", param).catch(err => err)
    return resK021Data
}
/**
 * 证件号码验证
 * @param {*} param 
 *  0670	证件类型	identTp
    0620	证件号码	identNo
    1265	主交易码	mainTranCd - 必填
 * @returns 
 */
const IdentNoVerify = async (param) => {
    const resK020Data = await request.post("k020", param).catch(err => err)
    return resK020Data
}
/**
 * 检查反洗钱监控
 * @param {*} param 
    0660	证件类型	identTp
    0620	证件号码	identNo
    0250	户名	acctNm
    0750	账号	acctNo
    0810	交易名称	tranNm
    0730	标志位	flgCd
 *  callback -- 函数
 */
const antiMoneyVerify = async (param, callback) => {
    try {
        let message = ''
        const res = await request.post("62b3mbfe", param).catch(err => err)
        // 未命中
        const { vrfyRslt, listTp, listTpDsc } = res
        if (vrfyRslt == '0') return callback(true)
        else if (vrfyRslt == '1') {
            // 命中政要类型，界面弹出提示
            if (listTp === '04') {
                message = "监控对象涉嫌" + listTpDsc + ',是否暂停交易？'
                const { retCd, retMsg } = await new Promise(resolve => {
                    nt.showMessagebox(message, '询问消息', {
                        type: 'error',
                        showCancelButton: true,
                        confirmButtonText: '继续',
                        cancelButtonText: '取消',
                        beforeClose: (action, _instance, done) => {
                            if (action === 'confirm') {
                                resolve({ retCd: true })
                            } else {
                                resolve({ retCd: false, retMsg: message })
                            }
                            done()
                        }
                    })
                })
                if (!retCd) {
                    return callback(false, retMsg)
                }
            } else {
                message = "监控对象涉嫌" + listTpDsc + ",拒绝交易、冻结资产、报告公安机关。"
                nt.showMessagebox(message, '警 告', {
                    type: 'error',
                    confirmButtonText: '确 定',
                })
                return callback(false, "交易拒绝")
            }
        } else if (vrfyRslt == '2') {
            message = "监控对象涉嫌" + listTpDsc + ",进行人工审核后才能继续交易。"
            nt.showMessagebox(message, '警 告', {
                type: 'error',
                confirmButtonText: '确 定',
            })
            return callback(false, "交易拒绝")
        }
    } catch (error) {
        nt.showMessagebox(
            '请求报错，请联系管理员', '警 告', {
            type: 'error',
            confirmButtonText: '确 定',
        })
        return
    }
}

const utils = {
    trimStart,
    fileDataFormat,
    getSelectData,
    startWith,
    getArr,
    checkCardBin,
    checkCard,
    IsNeedToCheckHighSecurity,
    dateValid,
    getSelectDataC,
    formatTime,
    isFunction,
    phoneValidate,
    getEnumValue,
    isAmountCheckPass,
    CheckPersonUKHead,
    splitOrMerge,
    getAcctInfo,
    getAcctList,
    parseFileData,
    showInfoBox,
    transformLabelByValue,
    getBase64,
    getVoucherBackground,
    emailValidate,
    getMergeAccountSeq,
    isAdult,
    padLeft,
    getB036DataList,
    getTlrMenuByTranCodeMethod,
    trimObjectValues,
    submitSearch,
    converToint,
    getPubMap,
    checkCsBrno,
    CheckQsBrno,
    addItemOfSelecteAll,
    dataURLtoBlob,
    addMonth,
    minusMonth,
    convertMonth,
    getEnumLable,
    IsCustomizeCompanyName,
    IsAcceptanc,
    hanziToUpperCasePinyin,
    formatNumber,
    stringToInt64,
    converToint32BitNumber,
    passwordVerify,
    addDate,
    removeLeadingZeros,
    IdentNoVerify,
    extractDate,
    antiMoneyVerify
}
export default utils

