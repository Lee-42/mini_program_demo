import UserVariable from "../common/UserVariable"
import utils from "./utils"

//ChagedMonthsToYearsUnitString-转化大于12个月的单位为年(存期单位转成年)
const ChagedMonthsToYearsUnitString = () => {

}
//SetSelectedKey-根据Key值为combo赋值
const SetSelectedKey = () => {

}
//ChagedNumberString-将数字串转换成中文数字串
const ChagedNumberString = () => {

}
//IsSamplePassword-弱密检查
const IsSamplePassword = () => {

}
//ChagedMonthsToYearsString-三位数字的转换
const ChagedMonthsToYearsString = () => {

}

/**
 * 格式化账户序号字符串
 * @param {String} str 字符串 
 * @param {*} flag 需要补充的字符串
 * @returns 返回格式化好的对象
 */
const AccountSeqFormat = (str, flag = '0') => {
    if (str?.trim()) {
        return utils.trimStart(str).padStart(UserVariable.MinLen_AccountSeqNo, flag)
    }
    return str
}
//ToDecimal-字符串转换成decimal对象
const ToDecimal = () => {

}
//GetTxtFileName-批量业务中构建转换后的txt文件名称
const GetTxtFileName = () => {

}
//ChangeToDateString-20120202232323转换日期格式 2012-02-02 23:23:23
const ChangeToDateString = () => {

}
//SetPrintTextBlock-检查账号是否允许刷卡，是，返回true；否，返回false
const SetPrintTextBlock = () => {

}
//AuthCheckAgnCnasp2-二代支付授权检查
const AuthCheckAgnCnasp2 = () => {

}
//IsCustomizeCompanyName-根据金融机构类型，判断是否可以自输客户名称
const IsCustomizeCompanyName = () => {

}
//GetGroupCodeByUserCode-获取指定柜员拥有的角色列表
const GetGroupCodeByUserCode = () => {

}
//GetServiceTime-获取形如HHMMSS的时间格式
const GetServiceTime = () => {

}
//IsNeedToCheckHighSecurity-检查是否需要做高风险检查
const IsNeedToCheckHighSecurity = () => {

}
//Convert4-四位数字的转换
const Convert4 = () => {

}
//Convert3-三位数字的转换
const Convert3 = () => {

}
//SetPrintMultiText-检查账号是否允许刷卡，是，返回true；否，返回false
const SetPrintMultiText = () => {

}
//ChangeToSBC-半角字符串转换成全角字符串
const ChangeToSBC = () => {

}
//DateToBig-将日期转换成大写
const DateToBig = () => {

}
//ToDateTime-将yyyyMMdd格式的字符串转换成对应的DateTime对象
const ToDateTime = () => {

}
//AllowSwipeCard-检查账号是否允许刷卡，是，返回true；否，返回false
const AllowSwipeCard = () => {

}
//ChangeMoneySymbol-将币种值转化成币种符号
const ChangeMoneySymbol = () => {

}
//FormatDateTime-
const FormatDateTime = () => {

}
//GetSystemDateAndTime-获取日期加时分秒
const GetSystemDateAndTime = () => {

}
//SetSelectedValue-ComboBox赋值的SelectValue扩展
const SetSelectedValue = () => {

}
//GetStrBytes-将字符串拆成byte[]后，按字节截取
const GetStrBytes = () => {

}
//CheckCard-根据介质类型判断是否是卡类介质
const CheckCard = () => {

}
//SetActItems-下拉框作为账号选择控件时，使用此扩展方法填充数据
const SetActItems = () => {

}
//IsTaxResidentByIdentity-根据证件类型判断税收类型是否是居民类型
const IsTaxResidentByIdentity = () => {

}
//IsVacationDay-判断某天日期是否为节假日
const IsVacationDay = () => {

}
//CommSend96-对应commsend_96
const CommSend96 = () => {

}
//IsNeedToShowByIdentity-根据指定的证件类型检查是否需要显示额外证件
const IsNeedToShowByIdentity = () => {

}
//GetSystemTime-获取时分秒,取Fd6的值,暂时为空
const GetSystemTime = () => {

}
//GetMoneyName-根据币种值获取名称
const GetMoneyName = () => {

}
//CheckEnterPriseUKHead-检查是否是对公椰盾冠字号
const CheckEnterPriseUKHead = () => {

}
//ConvertString-将数字转换成汉字
const ConvertString = () => {

}
//AddForceNotifyMessage-添加强制推送消息
const AddForceNotifyMessage = () => {

}
//GetCurrentDateTime-获取系统当前日期时间
const GetCurrentDateTime = () => {

}
//IsAmountCheckPass-金额类型检查
const IsAmountCheckPass = () => {

}
//IsVirtual-检查账号是否是虚拟子账号
const IsVirtual = () => {

}
//CheckPersonUKHead-检查是否是个人椰盾冠字号
const CheckPersonUKHead = () => {

}
//getTreeViewItem-遍历TreeViewItem
const getTreeViewItem = () => {

}
//NoteNoOfCard-截取卡号中凭证号 slzh
const NoteNoOfCard = () => {

}
//Convert2-两位数字的转换
const Convert2 = () => {

}
//WaitSuperAgnCnasp2-二代支付复核检查
const WaitSuperAgnCnasp2 = () => {

}
//GetUKTypeByNum-检查椰盾编号判断椰盾类型
const GetUKTypeByNum = () => {

}
//ExpandedItem-打开目标节点的父节点
const ExpandedItem = () => {

}
//isAdult-根据证件信息和当前日期判断是否为成年人
const isAdult = () => {

}
//CheckCsBrno-检查指定机构是否为参数中心、业务处理中心或财务
const CheckCsBrno = () => {

}
//FloatString-小数位转换
const FloatString = () => {

}
//FeeCheckAgnCnasp2-二代支付手续费
const FeeCheckAgnCnasp2 = () => {

}
//FindChildByName-在子元素中，查找指名字的控件
const FindChildByName = () => {

}
//SeachMemuTree-菜单栏搜索的拓展方法
const SeachMemuTree = () => {

}
//GetSurname-定义姓氏拼音
const GetSurname = () => {

}
//SystemstatuscheckCnasp2-系统检查,call9000交易
const SystemstatuscheckCnasp2 = () => {

}
//GetSelectedValue-ComboBox获得的SelectValue扩展
const GetSelectedValue = () => {

}
//GetKeyByValue-根据Value值查找Key,只适用于combobox的数据源是IEnumerable<KeyValuePair<string,string>>
const GetKeyByValue = () => {

}
//FillingPlaceholder-填充占位符
const FillingPlaceholder = () => {

}
//NumberString-判断数字位数以进行拆分转换
const NumberString = () => {

}
//AddOperationRecord-增加身份证图像操作记录
const AddOperationRecord = () => {

}
//CheckQsBrno-检查指定机构是否为清算机构
// const CheckQsBrno = (val) => {
//     let qs_list = ['461998']
//     return qs_list.includes(val)
// }
//ConstantIsExist-查找系统定义的常量是否存在
const ConstantIsExist = () => {

}
//SwitchDateFormat-转换日期格式 2012-2-2/2012/2/2 转化为20120202
const SwitchDateFormat = () => {

}
//GetFdStrBytes-将字符串拆成byte[]后，按字节截取，按照域的要求左对齐,空格补全
const GetFdStrBytes = () => {

}
//GetNamePinyin-获得名字的拼音 用空格间隔
const GetNamePinyin = () => {

}
//IsTellerEnable-柜员是否休假状态
const IsTellerEnable = () => {

}
//GetValueByKey-根据Key值查找Value,只适用于combobox的数据源是IEnumerable<KeyValuePair<string,string>>
const GetValueByKey = () => {

}
//CheckCardBin-检查账号是否是卡，是，返回true；否，返回false
const CheckCardBin = () => {

}
//GetRnd-增加身份证图像操作记录
const GetRnd = () => {

}

export default {
    ChagedMonthsToYearsUnitString, //转化大于12个月的单位为年(存期单位转成年)
    SetSelectedKey, //根据Key值为combo赋值
    ChagedNumberString, //将数字串转换成中文数字串
    IsSamplePassword, //弱密检查
    ChagedMonthsToYearsString, //三位数字的转换
    AccountSeqFormat, //格式化账户序号字符串
    ToDecimal, //字符串转换成decimal对象
    GetTxtFileName, //批量业务中构建转换后的txt文件名称
    ChangeToDateString, //20120202232323转换日期格式 2012-02-02 23:23:23
    SetPrintTextBlock, //检查账号是否允许刷卡，是，返回true；否，返回false
    AuthCheckAgnCnasp2, //二代支付授权检查
    IsCustomizeCompanyName, //根据金融机构类型，判断是否可以自输客户名称
    GetGroupCodeByUserCode, //获取指定柜员拥有的角色列表
    GetServiceTime, //获取形如HHMMSS的时间格式
    IsNeedToCheckHighSecurity, //检查是否需要做高风险检查
    Convert4, //四位数字的转换
    Convert3, //三位数字的转换
    SetPrintMultiText, //检查账号是否允许刷卡，是，返回true；否，返回false
    ChangeToSBC, //半角字符串转换成全角字符串
    DateToBig, //将日期转换成大写
    ToDateTime, //将yyyyMMdd格式的字符串转换成对应的DateTime对象
    AllowSwipeCard, //检查账号是否允许刷卡，是，返回true；否，返回false
    ChangeMoneySymbol, //将币种值转化成币种符号
    FormatDateTime, //
    GetSystemDateAndTime, //获取日期加时分秒
    SetSelectedValue, //ComboBox赋值的SelectValue扩展
    GetStrBytes, //将字符串拆成byte[]后，按字节截取
    CheckCard, //根据介质类型判断是否是卡类介质
    SetActItems, //下拉框作为账号选择控件时，使用此扩展方法填充数据
    IsTaxResidentByIdentity, //根据证件类型判断税收类型是否是居民类型
    IsVacationDay, //判断某天日期是否为节假日
    CommSend96, //对应commsend_96
    IsNeedToShowByIdentity, //根据指定的证件类型检查是否需要显示额外证件
    GetSystemTime, //获取时分秒,取Fd6的值,暂时为空
    GetMoneyName, //根据币种值获取名称
    CheckEnterPriseUKHead, //检查是否是对公椰盾冠字号
    ConvertString, //将数字转换成汉字
    AddForceNotifyMessage, //添加强制推送消息
    GetCurrentDateTime, //获取系统当前日期时间
    IsAmountCheckPass, //金额类型检查
    IsVirtual, //检查账号是否是虚拟子账号
    CheckPersonUKHead, //检查是否是个人椰盾冠字号
    getTreeViewItem, //遍历TreeViewItem
    NoteNoOfCard, //截取卡号中凭证号 slzh
    Convert2, //两位数字的转换
    WaitSuperAgnCnasp2, //二代支付复核检查
    GetUKTypeByNum, //检查椰盾编号判断椰盾类型
    ExpandedItem, //打开目标节点的父节点
    isAdult, //根据证件信息和当前日期判断是否为成年人
    CheckCsBrno, //检查指定机构是否为参数中心、业务处理中心或财务
    FloatString, //小数位转换
    FeeCheckAgnCnasp2, //二代支付手续费
    FindChildByName, //在子元素中，查找指名字的控件
    SeachMemuTree, //菜单栏搜索的拓展方法
    GetSurname, //定义姓氏拼音
    SystemstatuscheckCnasp2, //系统检查,call9000交易
    GetSelectedValue, //ComboBox获得的SelectValue扩展
    GetKeyByValue, //根据Value值查找Key,只适用于combobox的数据源是IEnumerable<KeyValuePair<string,string>>
    FillingPlaceholder, //填充占位符
    NumberString, //判断数字位数以进行拆分转换
    AddOperationRecord, //增加身份证图像操作记录
    // CheckQsBrno, //检查指定机构是否为清算机构
    ConstantIsExist, //查找系统定义的常量是否存在
    SwitchDateFormat, //转换日期格式 2012-2-2/2012/2/2 转化为20120202
    GetFdStrBytes, //将字符串拆成byte[]后，按字节截取，按照域的要求左对齐,空格补全
    GetNamePinyin, //获得名字的拼音 用空格间隔
    IsTellerEnable, //柜员是否休假状态
    GetValueByKey, //根据Key值查找Value,只适用于combobox的数据源是IEnumerable<KeyValuePair<string,string>>
    CheckCardBin, //检查账号是否是卡，是，返回true；否，返回false
    GetRnd, //增加身份证图像操作记录
}