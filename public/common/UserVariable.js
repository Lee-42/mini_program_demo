
/**
 *  全局变量
*/

// 海智通4号
const CPH_HZT4 = "2H4";

// 定期一本通 0016
const JZZL_DQYBT = "0016";

// 储蓄存折
const JZZL_CZ = "0010";

// 计息类型列表
const clcIntTpList = [
    { value: "0", label: "不计息" },
    { value: "1", label: "利随本清" },
    { value: "2", label: "按日计息" },
    { value: "3", label: "按月计息" },
    { value: "4", label: "按季计息" },
    { value: "5", label: "按年计息" }
]

const STATIC_ACCTTP_LIST = Object.freeze([
    { value: '1', label: "基本户" },
    { value: '2', label: "一般户" },
    { value: '3', label: "专用存款户" },
    { value: '4', label: "临时存款户" },
    { value: 'E', label: "外币对公活期户" },
    { value: 'F', label: "保证金账户" },
    { value: 'G', label: "外币保证金户" },
    { value: '9', label: "内部户" }
])
// 返回企业网银模块对应的渠道状态
const GetBusinessBankChannelState = [
    { label: "正常", value: "N" },
    { label: "注销", value: "C" },
    { label: "潜在", value: "P" },
    { label: "锁定", value: "L" },
    { label: "冻结", value: "F" }
]

// 返回企业网银模块对应的对公证件类型
export const GetBusinessBankComIdType = [
    { label: "组织机构代码证", value: "E00" },
    { label: "企业代码证", value: "E01" },
    { label: "营业执照", value: "E02" },
    { label: "企业名称核准书", value: "E03" },
    { label: "文件", value: "E04" },
    { label: "香港商业登记证", value: "E05" },
    { label: "开户证明", value: "E06" },
    { label: "军队开户许可证", value: "E07" },
    { label: "社会团体证", value: "E08" },
    { label: "金融许可证", value: "E10" },
    { label: "法人代码证", value: "E11" },
    { label: "国税登记证", value: "E12" },
    { label: "地税登记证", value: "E13" },
    { label: "登记证书", value: "E99" }
]

const UKEY_TYPE_LYD = "A08"; // 凭证种类--个人蓝牙key
const UKEY_TYPE_YPD = "A07"; // 凭证种类--个人音频key
const UKEY_TYPE_WYD = "A06"; // 凭证种类--企业网银椰盾
const UKEY_TYPE_YQZLD = "A09"; // 凭证种类--银企直连椰盾
const UKEY_TYPE_QYLYD = "A011"; // 凭证种类--企业网银蓝牙盾

const PZZL_ZZZP = 'A02' // 凭证种类--转账支票
const PZZL_JSYESQS = 'D17' // 凭证种类--电汇凭证
const PZZL_QTPZ = '299' // 凭证种类--其他凭证
const PZZL_DG_ZZZP = 'A02' // 凭证种类--转账支票
const PZZL_DQCD = 'C31' // 凭证种类--储蓄定期存单
const PZZL_XJZP = 'A01' // 现金支票
const CPH_CZLYE = '12R' // 财政零余额
const PZZL_CZ = "C30" // 凭证种类--储蓄存折
const YW_TYPE_XHZC = '3b00' // 销户转出

const GetPerPwdflag = [
    { label: "密码支取", value: "Y" },
    { label: "证件支取", value: "ZJ" },
    { label: "密码证件支取", value: "MMZJ" },
    { label: "无密不凭证件", value: "NZJ" }
]
const JZZL_DQCD = '0013' // 介质种类--储蓄定期存单
const Len_VoucherNo = '8' // 凭证号 长度
const Len_AccountSeqNo = '4' // 账户顺序号 长度
const MinLen_AccountSeqNo = '1' // 账户顺序号 长度
const Getbz_RMB = [
    { label: "人民币", value: "01" }
]
// 获取计息类型
const Getjxlx = [
    { label: "不计息", value: "0" },
    { label: "利随本清", value: "1" },
    { label: "按日计息", value: "2" },
    { label: "按月计息", value: "3" },
    { label: "按季计息", value: "4" },
    { label: "按年计息", value: "5" }
]
// 个人账户结算类型
const GetPerActType = [
    { label: "个人结算户", value: "D" }
]
// 转现标志类型
const Getcashflag = [
    { label: "现金", value: "1" },
    { label: "转账", value: "2" }
]
// 钞汇标志
const GetOdtt = [
    { label: "钞户", value: "0" },
    { label: "汇户", value: "1" }
]
// 理财介质类型转换
const MediaType = {
    1: '01',
    3: '02',
    4: '02',
    5: '02',
    8: '03',
}
// 对公户账户类型
const GetAcctType = [
    { label: "基本户", value: "1" },
    { label: "一般户", value: "2" },
    { label: "专用存款户", value: "3" },
    { label: "临时存款户", value: "4" },
    { label: "外币对公活期户", value: "E" },
    { label: "保证金账户", value: "F" },
    { label: "外币保证金户", value: "G" }
]
// 获取密码类型
const Getpswdcd = [
    { label: "是", value: "Y" },
    { label: "否", value: "N" }
]
// 通用“是/否”选择
const GetYorN = [
    { label: "是", value: "Y" },
    { label: "否", value: "N" }
]
// 获取客户类型
const GetCustomerType = [
    { label: "个人", value: "1" },
    { label: "对公", value: "1" }
]
// 币种类型
const GetBZType = [
    { label: "人民币", value: "01" }
]
// 获取对公人民币账户类型
const GetAcctTypeRMB = [
    { label: "基本户", value: "1" },
    { label: "一般户", value: "2" },
    { label: "专用存款户", value: "3" },
    { label: "临时存款户", value: "4" }
]
// 外币对公账户类型
const GetAcctTypeWB = [
    { label: "外币对公活期户", value: "E" }
]
const PZZL_DWYJK = 'B05' // 凭证种类--单位印鉴卡
// 转现标志类型
const Getctind = [
    { label: "转账", value: "2" }
]
// 人民币保证金账户
const GetAcctTypeRMBBZJ = [
    { label: "保证金账户", value: "F" }
]
// 外币保证金账户
const GetAcctTypeWBBZJ = [
    { label: "外币保证金账户", value: "G" }
]
// 获取外币限额类型
const GetForeignLimit = [
    { label: "无限额", value: "0" },
    { label: "余额限额", value: "1" },
    { label: "贷方流入限额", value: "2" },
]
// ATM开通控制
export const Getatmk = [
    { label: "否", value: "0" },
    { label: "是", value: "1" }
]
// 地区创新类型
export const GetAreaType_ACCT = [
    { label: "境内", value: "0" },
    { label: "海南自贸区", value: "1" }
]
// 对公户账户类型   20120524  对公现金存款  增加外币对公户 HNWBGZ
const GetAcType = [
    { label: "基本户", value: "1" },
    { label: "一般户", value: "2" },
    { label: "专用存款户", value: "3" },
    { label: "临时存款户", value: "4" },
    { label: "个人户", value: "5" },
    { label: "协定户", value: "6" },
    { label: "基金户", value: "7" },
    { label: "其他户", value: "9" },
    { label: "外币对公户", value: "E" }
]
// 获取借贷类型  对公和内部记账
const GetDcind = [{ label: "借", value: "1" }, { label: "贷", value: "2" }]
// 获取贷款支取限额控制
const Getzqxe = [{ label: "否", value: "1" }, { label: "是", value: "2" }]
// 凭证种类--银行承兑汇票
const PZZL_YHCDHP = "B01";
const CPH_WTCKJJ = '937' // 委托存款基金产品号
const CPH_WTSY = '0' // 委托收益产品号
const Getxhbz = [{ label: "销户", value: "1" }]
const PZZL_LYD = 'PZZL_LYD'
const PZZL_PTJBK = 'PZZL_PTJBK'
const PZZL_YHJBK = 'PZZL_YHJBK'
const UserVariable = {
    MediaType,
    JZZL_CZ,
    CPH_HZT4,
    clcIntTpList,
    STATIC_ACCTTP_LIST,
    UKEY_TYPE_LYD,
    UKEY_TYPE_YPD,
    UKEY_TYPE_WYD,
    UKEY_TYPE_YQZLD,
    UKEY_TYPE_QYLYD,
    JZZL_DQYBT,
    PZZL_ZZZP,
    PZZL_JSYESQS,
    PZZL_QTPZ,
    PZZL_DQCD,
    PZZL_XJZP,
    PZZL_CZ,
    CPH_CZLYE,
    GetBusinessBankChannelState,
    GetBusinessBankComIdType,
    GetPerPwdflag,
    JZZL_DQCD,
    Len_VoucherNo,
    Len_AccountSeqNo,
    MinLen_AccountSeqNo,
    Getbz_RMB,
    Getjxlx,
    YW_TYPE_XHZC,
    GetPerActType,
    Getcashflag,
    GetOdtt,
    GetAcctType,
    Getpswdcd,
    GetYorN,
    GetCustomerType,
    GetBZType,
    GetAcctTypeRMB,
    GetAcctTypeWB,
    PZZL_DWYJK,
    Getctind,
    GetAcctTypeRMBBZJ,
    GetForeignLimit,
    Getatmk,
    GetAreaType_ACCT,
    GetAcType,
    GetDcind,
    Getzqxe,
    GetAcctTypeWBBZJ,
    PZZL_YHCDHP,
    PZZL_DG_ZZZP,
    CPH_WTCKJJ,
    CPH_WTSY,
    Getxhbz,
    PZZL_LYD,
    PZZL_PTJBK,
    PZZL_YHJBK
}
export default UserVariable