// ������дӳ��
const MoneySymbol = {
    "01": "CNY",
    "12": "GBP",
    "13": "HKD",
    "14": "USD",
    "15": "CHF",
    "18": "SGD",
    "27": "JPY",
    "28": "CAD",
    "29": "AUD",
    "38": "EUR",
    "90": "RUB",
}

// ����
const CashAccount = '0'

// �㻧
const ExchangeAccount = '1'

// ��Ԫ��־
const CUR_JPY = "27"

// 个人Ukey长度
const PersonUkeyLength = 16;

// 对公Ukey长度
const EnterpriseUkeyLength = 16;

// 库存现金 科目号  
const CASH_ACC_NO = "100101";

//存现
const YW_TYPE_CX = "1100";

// 个人客户
const PersonalClient = '1'
// 对公客户
const CompanyClient = "2"
// 账户顺序号 长度
const LenAccountSeqNo = 4;
// 验磁
const CHK_MSR_Y = '1'
// 活期账号
const DepositAccount = "1";
// 定期账号
const FixedAccount = "2";
// 贷款账号
const LoanAccount = "3";
// 科目
const SubjectAccount = "0";
// 内部账号
const InternalAccount = "9";

// 业务处理中心（原清算中心）
const QS_Center = "461998";
// 科技部
const Tec_Center = "461014";
// 参数中心
const CS_Center = "461015";
// 财务管理部
const FIN_Center = "461008";
// 存折对应的凭证类型值
const BankBookType = "0010";
// UK冠字头
const UKCrownHead = "BANKHN";

// 枚举
const MergeAccountSeqOptions = {
    Merged: "Merged", // 合并
    Devided: "Devided" // 拆分
}

// 外币库存现金 科目号
const WB_CASH_ACC_NO = "100101"

// 不验磁
const CHK_MSR_N = "0"

// 一般转出 
const YW_TYPE_ZC = "3100"

// 验密 
const CHK_PWD_Y = "1";
// 由核心系统决定验磁标志
const CHK_MSR_O = "2";
const Glob_Y = 'Y'; // 公用变量-是
const Glob_N = 'N'; // 公用变量-是

//不验密 
const CHK_PWD_N = "0";

// 基本户
const BasicDepositAccount = "1";
// 一般户
const GeneralDepositAccount = "2";
// 临时户
const TemporaryDepositAccount = "4";
// 专用户
const SpecialDepositAccount = "3";
// 人民币保证金账户
const MarginAccount = "F";
// 外币保证金账户
const ForeignCurMarginAccount = "G";
// 外币户
const ForeignCurAccount = "E";
const CUR_RMB = '01'

// C428中间业务参数查询
const BusinessType0fQueryTibParameter = {
    //     险种代码
    InsuranceCode: 0,
    //     社保单位代码
    SecurityDepartmentCode: 1,
}
const PersonalHKMacaoPassId = "7"; // 港澳通行证
const PersonalHKMacaoId = "W"; //港澳居住证
const EnterpriseRegisIdType = "D"; //登记证书

// 返回企业网银模块对应的对公证件类型
const GetBusinessBankComIdType = [
    { value: "E00", label: "组织机构代码证" },
    { value: "E01", label: "企业代码证" },
    { value: "E02", label: "营业执照" },
    { value: "E03", label: "企业名称核准书" },
    { value: "E04", label: "文件" },
    { value: "E05", label: "香港商业登记证" },
    { value: "E06", label: "开户证明" },
    { value: "E07", label: "军队开户许可证" },
    { value: "E08", label: "社会团体证" },
    { value: "E10", label: "金融许可证" },
    { value: "E11", label: "法人代码证" },
    { value: "E12", label: "国税登记证" },
    { value: "E13", label: "地税登记证" },
    { value: "E99", label: "登记证书" }
]
// 钞汇标志
const GetOdtt = [
    { value: "0", label: "钞户" },
    { value: "1", label: "汇户" },
]
const SystemFlagOfNetBank = "EIBS" // 企业网银渠道标识
// 证件数据
const getBussinessIdType = [
    { label: "身份证", value: "P00" },
    { label: "户口簿", value: "P07" },
    { label: "军官证", value: "P01" },
    { label: "中国护照", value: "P05" },
    { label: "回乡证", value: "P24" },
    { label: "港澳台居民通行证", value: "P06" },
    { label: "临时身份证", value: "P10" },
    { label: "外国人永久居留证", value: "P09" },
    { label: "警官证", value: "P03" },
    { label: "其他证件(对私)", value: "P99" },
    { label: "台湾居民往来通行证", value: "P13" },
    { label: "文职干部证", value: "P02" },
    { label: "士兵军人证", value: "P04" },
    { label: "边民出入境通行证", value: "P08" },
    { label: "离休干部荣誉证", value: "P11" },
    { label: "武警警官证誉证补折", value: "P12" },
    { label: "军官退休证", value: "P14" },
    { label: "文职干部退休证", value: "P15" },
    { label: "军事院校学员证", value: "P16" },
    { label: "武警士兵证", value: "P17" },
    { label: "武警文职干部证", value: "P18" },
    { label: "武警军官退休证", value: "P19" },
    { label: "武警文职干部退休证", value: "P20" },
    { label: "驾驶执照", value: "P21" },
    { label: "外国护照", value: "P23" },
    { label: "旧身份证", value: "P22" }
]
const Len_CardNo = 19 // 卡号长度
const SystemFlagOfIdCheck = 'idck' //联网核查系统标识
const ForexCashDraw = 'TQ' // 交易类型-现钞提取 
const ForexCashSave = "CR"; // 交易类型-现钞存入
const ForexSettExch = 'JH'; // 结汇标志
const TradeNormal = '0' // 交易标识-正常
const TradeByCase = '1' // 现金交易方式
const YW_TYPE_XHZC = '3b00' // 销户转出
const Len_NoteNo = 16 // 凭证号长度

const CommunicationSuccessCode = '0000' // 应答成功码
const CommunicationSuccessCodeOfBMS = '0000' // esb应答成功码

const IdentityTypeChangeDirection = {
    // 核心证件类型转其他证件类型
    CoreToOther: 0,
    // 其他证件类型转核心证件类型
    OtherToCore: 1,
}
const Len_AcName = 120 // 户名长度 120位
const ForeignAccountAttribute = '1' // 外汇账户性质
const YW_TYPE_QX = "2100"; // 取现
const AreaType_HNFT = '1' // 地区创新类型-海南自贸区
const EnterpriseBusiLicenIdType = 'A' // 营业执照
const EnterpriseOrgaIdType = '8' // 组织机构代码证
const YW_TYPE_ZR = '4100' // 一般转入
const GlobalVariable = {
    MoneySymbol,
    CashAccount,
    ExchangeAccount,
    CommunicationSuccessCode,
    CommunicationSuccessCodeOfBMS,
    CUR_JPY,
    PersonUkeyLength,
    EnterpriseUkeyLength,
    CASH_ACC_NO,
    PersonalClient,
    CompanyClient,
    LenAccountSeqNo,
    MergeAccountSeqOptions,
    YW_TYPE_CX,
    WB_CASH_ACC_NO,
    CHK_MSR_N,
    YW_TYPE_ZC,
    CHK_PWD_Y,
    CHK_MSR_O,
    CHK_PWD_N,
    Glob_Y,
    Glob_N,
    DepositAccount,
    FixedAccount,
    LoanAccount,
    SubjectAccount,
    InternalAccount,
    QS_Center,
    Tec_Center,
    CS_Center,
    FIN_Center,
    BankBookType,
    UKCrownHead,
    BasicDepositAccount,
    GeneralDepositAccount,
    TemporaryDepositAccount,
    SpecialDepositAccount,
    MarginAccount,
    ForeignCurMarginAccount,
    ForeignCurAccount,
    CUR_RMB,
    BusinessType0fQueryTibParameter,
    PersonalHKMacaoPassId,
    PersonalHKMacaoId,
    EnterpriseRegisIdType,
    GetOdtt,
    SystemFlagOfNetBank,
    getBussinessIdType,
    GetBusinessBankComIdType,
    Len_CardNo,
    SystemFlagOfIdCheck,
    TradeNormal,
    ForexCashSave,
    ForexCashDraw,
    ForexSettExch,
    TradeByCase,
    YW_TYPE_XHZC,
    Len_NoteNo,
    IdentityTypeChangeDirection,
    CHK_MSR_Y,
    Len_AcName,
    ForeignAccountAttribute,
    YW_TYPE_QX,
    AreaType_HNFT,
    EnterpriseOrgaIdType,
    EnterpriseBusiLicenIdType,
    YW_TYPE_ZR
}

export default GlobalVariable