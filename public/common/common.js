const FlgType = [{
    value: '0',
    label: '是'
},
{
    value: '1',
    label: '否'
}]

const FlgType2 = [{
    value: '1',
    label: '是'
},
{
    value: '2',
    label: '否'
}]

const FlgType3 = [{
    value: '0',
    label: '否'
},
{
    value: '1',
    label: '是'
}]

const FlgType4 = [{
    value: '01',
    label: '否'
},
{
    value: '02',
    label: '是'
}]

const CustomerType = [
    {
        value: '1',
        label: '[0]个人'
    },
    {
        value: '2',
        label: '[1]公司'
    }]

const HeshiType = [
    {
        value: 'N',
        label: '未核实'
    },
    {
        value: 'Y',
        label: '已核实'
    }]

const CstLvl = [
    {
        value: '0',
        label: '普通客户'
    }
]

const VatcstType = [
    {
        value: '01',
        label: '金融机构'
    },
    {
        value: '02',
        label: '非金融机构'
    },
    {
        value: '03',
        label: '个体工商户'
    },
    {
        value: '04',
        label: '个人'
    }]

const TaxpyType = [
    {
        value: '01',
        label: '一般纳税人'
    },
    {
        value: '02',
        label: '小规模纳税人'
    },
    {
        value: '03',
        label: '其他'
    }]

const DwBillTp = [
    {
        value: '00',
        label: '不开票'
    },
    {
        value: '01',
        label: '增值税专用发票'
    },
    {
        value: '02',
        label: '增值税普通发票'
    }
]

const CstConDgrValType = [
    {
        value: '1',
        label: '低'
    }
]

const EmptyBaseType = [
    {
        value: '0',
        label: '无'
    }
]

const JuminType = [
    {
        value: '0',
        label: '居民'
    },
    {
        value: '1',
        label: '非居民'
    }
]

const DstcInvtType = [
    {
        value: '0',
        label: '境内'
    }
]

const ChrydOvrsFlgType = [
    {
        value: '01',
        label: '境内'
    },
    {
        value: '02',
        label: '境外'
    }
]

const HeadType = [
    {
        value: '1',
        label: '企业法人'
    },
    {
        value: '2',
        label: '单位负责人'
    }
]

const TaxVatcstType = [
    {
        value: '01',
        label: '仅为中国税收居民'
    },
    {
        value: '02',
        label: '仅为非居民'
    },
    {
        value: '03',
        label: '既是中国税收居民又是其他国家(地区)税收居民'
    }
]

const IdCardType = [
    {
        value: '00',
        label: '[00]身份证'
    },
    {
        value: '01',
        label: '[01]户口簿'
    },
    {
        value: '02',
        label: '[02]护照'
    },
    {
        value: '03',
        label: '[03]回乡证'
    },
    {
        value: '04',
        label: '[04]港澳居民来往通行证'
    },
    {
        value: '05',
        label: '[05]临时身份证'
    },
    {
        value: '06',
        label: '[06]外国人永久居留身份证'
    },
    {
        value: '07',
        label: '[07]警官证'
    },
    {
        value: '08',
        label: '[08]其他证件（对私）'
    },
    {
        value: '09',
        label: '[09]台湾同胞来往通行证'
    },
    {
        value: '10',
        label: '[10]港澳居民居住证'
    },
    {
        value: '11',
        label: '[11]台湾居民居住证'
    }
]

const area_type_list = [
    {
        value: "0",
        label: "境内"
    },
    {
        value: "1",
        label: "海南自贸区"
    }
]

const SelectDataType = {
    C021: 'C021', // 客户等级
    C023: 'C023', // 公司类型
    C008: 'C008', // 职业
    C029: 'C029 ', // 国籍
    C004: 'C004', // 个人证据类型列表
    C003: 'C003', // 对公类型列表
    C001: 'C001', // 客户类型
    C002: 'C002', // 证件类型
    C031: 'C031', // 联网核查结果列表
    C032: 'C032', // 联网标志列表
    C030: 'C030', // 获取性别列表
    C009: 'C009', // 获取受益人类型
    C010: 'C010', // 公司职务
    C011: 'C011', // 信托控制人类型
    C012: 'C012', // 客户名称
    '0083': '0083', // 同业标志
    '0072': '0072', // 止付类型
    '0075': '0075', // 钞汇标志
    '0078': '0078', // 业务种类
    '0005': '0005', // 选择印鉴方式
    '0099': '0099', // 批量处理状态
    '0080': '0080', // 介质类型
    '0026': '0026', // 处理状态
    R001: 'R001', // 利率类型
    C019: 'C019', // 金融机构类型一级菜单
    C038: 'C038', // 金融机构二级菜单
    C044: 'C044', // 同业国民经济（一级）
    C045: 'C045', // 非同业国民经济（一级）
    C026: 'C026', // 二级国民经济
    C015: 'C015', // 一级控股类型
    C016: 'C016', // 二级控股类型
    C017: 'C017', // 三级控股类型
    CURALL: 'CUR_ALL', // 银行所支持的所有币种
    ALLCUR: 'ALL_CUR', // 获取所有已经启用的币种
    C013: 'C013', // 实际控制人证件类型
    C035: 'C035', // 经济类型
    C024: 'C024', // 一级行业分类
    C025: 'C025', // 二级行业分类
    C050: 'C050', // 三级行业分类
    C051: 'C051', // 四级行业分类
    C014: 'C014', // 
    C036: 'C036', // 查询省市区
    C042: 'C042', // 查询评估题
    C043: 'C043', // 调整渠道
    D011: 'D011', // 产品名称
    D012: 'D012', // 产品名称
    CURSIGN: 'CUR_SIGN', // 根据币种获取币码
    K042: 'k042',  //字典数据
    DQDM01: 'DQDM01', // 列表编码
    CUR_NO: 'CUR_NO', // 所有币种
    ALL_CUR: 'ALL_CUR', // 获取所有已经启用的币种
    N006: 'N006', // 介质类型
    N007: 'N007', // 
    CXBS: 'CXBS', // 地区创新标识
    '0007': '0007', // 介质种类
    '0047': '0047', // 凭证类型 1
    'PZ01': 'PZ01', // 凭证类型 2
    N001: 'N001', // 凭证类型 3
    WTCK: 'WTCK', // 产品代码
    WTDKBXZS: 'WTDKBXZS', // 产品代码
    A007: "A007", // 保证金
    "0043": "0043",
    "0044": "0044",
    "0073": "0073", // 凭证种类
    A013: 'A013', // 锁定种类
    N002: "N002", // 凭证类型
    D005: "D005", // 利率查询
    D004: "D004", // 产品代码
    D003: "D003", // 付息类型
    A023: "A023", // 产品列表
    D038: "D038", // 获取保险公司存放资本保证金
    D009: "D009", // 区分币种
    D008: "D008", // 利率取值
    "0057": "0057", // 通存范围、通兑范围
    XD01: "XD01", // 
    ST01: 'ST01', // 凭证类型
    BR_NO: 'BR_NO', // 币种 有外币
    JBBB: 'JBBB', // 版别
    JBQB: 'JBQB', // 券别
    '0032': '0032', // 止付类型
    '0079': '0079', // 执法机关
    C006: 'C006', // 证件类型
    C040: 'C040', // 
    "0011": "0011", // 凭证类型
}
const businessType = {
    // { "账户存钞", "01" }, { "外币兑换对外存入", "05" }, { "其他存钞", "07" }
    '01': '账户存钞',
    '05': '外币兑换对外存入',
    '07': '其他存钞',
}
const ErrorMessage = {
    N001: "初始化交易信息失败，无法打开交易",
    N002: "证件号码无效，请检查",
    N003: "该证件号码应为18位,请检查",
    N004: "该证件尚未建立客户信息，是否建立",
    N005: "该客户已被登记到黑名单，不允许办理业务",
    N006: "结束日期不能小于开始日期",
    N007: "所选币种与所选产品的币种不同",
    N008: "电话号码不足7位，请检查",
    N009: "手机号不足11位，请检查",
    N010: "利率必须大于0，请检查",
    N011: "利率必须小于100，请检查",
    N012: "请输入对公账户",
    N013: "请输入个人账户",
    N014: "请输入活期账户",
    N015: "请输入定期账户",
    N016: "请输入内部账户",
    N017: "非本行账户，该业务需到开户行办理",
    N018: "该日期不能小于当前日期",
    N019: "请检查金额是否有误,确认继续,取消重新输入",
    N020: "账户可用余额不足，请检查",
    N021: "金额必须大于0.00",
    N022: "该介质已销户",
    N023: "该介质处于非正常状态",
    N024: "该介质已挂失",
    N025: "该介质已挂失换证",
    N026: "该介质已换证",
    N027: "该账户已临时销户",
    N028: "该账户已销户",
    N029: "该账户已挂失",
    N030: "该账户处于开户待确认状态",
    N031: "该账户处于开户更正状态",
    N032: "该账户处于非正常状态",
    N033: "该账户处于不进不出状态",
    N034: "该账户处于只进不出状态",
    N035: "转出账号与转入账号不能为同一账号",
    N036: "刷卡错误,请重试",
    N037: "输入凭证号与原凭证号不符,请检查",
    N038: "录入的证件信息与账号对应的证件信息不符，请检查",
    N039: "请选择一条账户信息",
    N040: "该日期不能大于当前日期",
    N041: "截止日期不能小于起始日期",
    N042: "请选择一条客户信息",
    N043: "转入账户和转出账户的币种不同",
    N044: "刷卡错误,请重试",
    N045: "证件号码与账户不匹配",
    N046: "证件类型与账户不匹配",
    N047: "该介质已部提换证",
    N048: "该介质已损坏换证",
    N049: "没有可选客户信息",
    N050: "没有可选账户信息",
    N051: "该账户已正常换证",
    N052: "该账户已部提换证",
    N053: "该账户已开户撤销",
    N054: "请输入存款账户",
    N055: "该账户已挂失换证",
    N056: "该介质已过期",
    N057: "该协议编号已存在",
    N058: "该协议非信贷审批状态",
    N059: "该借据非审批状态",
    N060: "该协议编号不存在",
    N061: "该协议非录入状态",
    N062: "到期日期与信贷审批不符",
    N063: "申请日期不能大于到期日期",
    N064: "承兑类型与信贷审批不符",
    N065: "协议金额与信贷审批不符",
    N066: "请输入本行账户",
    N067: "该协议下质押物品非入库状态",
    N068: "该账号与信贷录入不符",
    N069: "金额与信贷录入不符",
    N070: "到期日期与信贷录入不符",
    N071: "柜员无此类型凭证",
    N072: "非最小凭证号",
    N073: "该票据号不存在",
    N074: "该票据挂失状态不正常",
    N075: "该票据处于非正常状态",
    N076: "该票据已到期",
    N077: "该票据已退票",
    N078: "该票据已核销",
    N079: "该票据已被质押",
    N080: "该票据非本行票据",
    N081: "该票据已挂失",
    N082: "该票据已做委托",
    N083: "该票据已冻结",
    N084: "请输入保函保证金账户",
    N085: "请输入承兑保证金账户",
    N086: "输入信息与协议信息不符",
    N300: "共返回0条记录，请重新操作",
    N301: "没有得到选择的数据信息，请重新操作",
    N302: "密码无效，请重新输入",
    N303: "账/卡号无效，请重新输入",
    N304: "柜员现金余额不足",
    N305: "读卡失败，请重新操作",
    N306: "柜员未签到",
    N307: "账号余额不足",
    N308: "凭证号码无效",
    N104: "该账户处于部分止付状态",
    N103: "该账户处于全部止付状态",
    N102: "该账户处于部分冻结状态",
    N101: "该账户处于完全冻结状态",
    N100: "电信诈骗涉案账户，不允许交易",
    N090: "电信诈骗可疑账户，谨防诈骗，是否继续？",
    N110: "使用非居民身份证办理业务，请前往高风险客户信息查询界面验证",
    N111: "不允许使用简单密码",
    N091: "该客户命中高风险国家（地区）名单，请采取强化尽职调查措施！是否继续",
    N092: "申请成功，交易将于开放期结束后下一工作日进行确认",
    N112: "临时户已过期",
}

// 获取基金开户要求的证件类型
const GetFundIdType = [
    { value: "1", label: "身份证" },
    { value: "2", label: "户口簿" },
    { value: "7", label: "港澳居民来往通行证" },
    { value: "F", label: "外国人永久居留身份证" },
    { value: "I", label: "台湾同胞来往通行证" },
    { value: "W", label: "港澳居民居住证" },
    { value: "Y", label: "台湾居民居住证" }
]

// 请求系统类型（用于接口交互）
const SysType = {
    // ESB: 'ESB', // Esb
    ESB: 'esb', // esb
    MBFE: 'mefe' // 核心前置
}

// 卡bin号码
const cabin = ["623621", "62326616"]

// 人民币标识
const cur_rmb = '01'

// 钞户
const cashAccount = '0'

// 汇户
const exchangeAccount = "1";

// 个人客户
const personalClient = '1'

// 定期账号
const fixedAccount = "2"

// 海智通4号
const CPH_HZT4 = "2H4";

// 地区创新类型-海南自贸区
const AreaType_HNFT = "1"

// 地区创新类型-境内
const AreaType_INTERNAL = "0"

// 受控账户检查 类型
const CheckControledAccountType = {
    // 不检查
    None: -1,
    //检查柜面受控账户类型
    Nomal: 0,
    // 检查所有受控账户类型，只要符合受控账户就不允许操作
    All: 1,
}

// 检查客户类型
const AllowClientType = {
    // 不检查
    None: -1,
    //个人
    Person: 1,
    // 对公
    Company: 2,
}

// 检查账户类型
const AllowAccountType = {
    // 不检查
    None: -1,
    // 活期
    Deposit: 1,
    // 定期
    Fixed: 2,
    // 内部户
    Inner: "Inner",
    // 活期加定期
    DepositAndInner: "DepositAndInner",
    // 定期加内部户
    FixedAndInner: "FixedAndInner",
    // 活期加定期
    DepositAndFixed: "DepositAndFixed"
}

// 检查办理机构
const AllowBusinessKinbrType = {
    // 不检查
    None: -1,
    // 个人对公均在本机构
    LocalKinbr: 1,
    // 个人不限制机构，对公只能在业务处理中心，参数中心和开户机构
    Special: 2,
}

// 保证金账户限制 类型
const AllowMarginType = {
    // 不检查
    None: -1,
    // 不允许
    Forbid: "Forbid"
}

// 需要提示的管控账户类型
const AllowShowTipAccountType = {
    // 不检查
    None: -1,
    //都允许
    All: 1
}
// 账户状态校验
const AllowAccountState = {
    // 不检查
    None: -1,
    //待确认
    TobeConfirmedOnly: 0,
    // 正常
    Nomal: 1,
    // 久悬户
    HandedOnly: 6,
    // 正常和开户待确认
    TobeConfirmed: 20,
    // 正常和久悬
    Handed: 21,
    // 正常,待确认和久悬
    HandedAndTobeConfirmed: 22,
}

// 介质状态校验
const AllowMediaState = {
    // 不检查
    None: -1,
    // 正常
    Nomal: 0,
    // 挂失
    LossOnly: 1,
    //未激活
    ActivatedOnly: 7,
    // 待销户
    ClosingOnly: 8,
    // 正常和挂失
    Loss: 20,
    // 正常和未激活
    Activated: 21,
    // 正常和待销户
    Closing: 22,
    // 正常,挂失,未激活
    LossAndActivated: 23,
    // 正常,挂失,待销户
    LossAndClosing: 24,
    // 正常,挂失,未激活，待销户
    LossAndActivatedClosing: 25,
}

// 账户止付校验
const AllowStopPaymentState = {
    // 不检查
    None: -1,
    //部分止付
    PartStopOnly: 3,
    // 正常
    Nomal: 0,
    // 正常和部分止付
    PartStop: 20,
}

// 账户冻结校验 类型
const AllowFreePaymentState = {
    // 不检查
    None: -1,
    //部分冻结
    FreeStopOnly: 3,
    // 正常
    Nomal: 0,
    // 正常和部分冻结
    FreeStop: 20,
    // 正常，部分冻结，只进不出的完全冻结
    NoAllFree: 21,
}

// 检查通存通兑
const AllowDepositAndWithdrawal = {
    // 不检查
    None: -1,
    // 通兑
    Withdrawal: 1,
    // 通存
    Deposit: 2,
}
// 电信诈骗
const TelecommunicationFraudType = {
    // 不检查
    None: -1,
    // 正常检查，涉案禁止交易，可疑询问
    Nomal: 0,
    // 涉案和可疑都禁止
    AllStop: 1,
}
// 反洗钱
const AntiMoneyLaunderingType = {
    // 不检查
    None: -1,
    //检查账户类
    Nomal: 0,
}
// 卡性质
const KMXZ = 'KMXZ'
// 金额类型
const moneyType = {
    '50000': 50000,
    '500000': 500000,
    '5000000': 5000000,
    '200000': 200000,
}
const tipsMoney = '库存人民币现金' // 金额提示
// 参数代码
const parmCd = 'YZ_CIF'
const commonData = {
    FlgType,
    FlgType2,
    FlgType3,
    FlgType4,
    CustomerType,
    HeshiType,
    CstLvl,
    VatcstType,
    TaxpyType,
    DwBillTp,
    CstConDgrValType,
    EmptyBaseType,
    JuminType,
    DstcInvtType,
    ChrydOvrsFlgType,
    HeadType,
    TaxVatcstType,
    IdCardType,
    area_type_list,
    SelectDataType,
    cabin,
    cur_rmb,
    cashAccount,
    personalClient,
    fixedAccount,
    exchangeAccount,
    CPH_HZT4,
    AreaType_HNFT,
    businessType,
    ErrorMessage,
    AreaType_INTERNAL,
    SysType,
    GetFundIdType,
    CheckControledAccountType,
    AllowClientType,
    AllowAccountType,
    AllowBusinessKinbrType,
    AllowMarginType,
    AllowShowTipAccountType,
    AllowAccountState,
    AllowMediaState,
    AllowStopPaymentState,
    AllowFreePaymentState,
    AllowDepositAndWithdrawal,
    TelecommunicationFraudType,
    AntiMoneyLaunderingType,
    KMXZ,
    moneyType,
    tipsMoney,
    parmCd
}

export default commonData
