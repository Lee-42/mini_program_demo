/*
version 1128
*/
import api from "./api.js"
import explane from "./explane.js"
import tranpop from './tranpop.js'
import print from './print.js'
import commonApi from './commonApi.js'



// console.log(window.$)
// import poptable from "./poptable.js"
let common = {}

/*
 * 封装账户列表弹窗
 * @param tableData :表格数据
 * @param callback :选择后回调 
 */
common.popTable = (tableData, callback) => {
	tranpop.popTable(tableData, callback)
};

common.print = (data) => {
	return print.print(data)
}


common.finish = (params, appid) => {
	commonApi.finish(params, appid)
}


/*
 * @param obj :请求对象
 * @param obj.url :请求地址
 * @param obj.data :请求报文
 * @param obj.success :成功回调
 * @param obj.error :失败回调
 * 
 */
common.request = (data) => {
	api.request(data);
};
common.downloadFile = (data) => {
	api.downloadFile(data);
};
common.uploadFile = (data) => {
	api.uploadFile(data);
};

/*
核心文件字符串转json
@param txt 核心返回字符串
@param keys 自定义表头，字符串数组，表头顺序要与值的顺序对应
*/
common.fileStringToJson = (txt, keys) => {
	return explane.fileStringToJson(txt, keys);
};

const JSONStr = JSON.parse(localStorage.getItem('userInfo')) || {}
/** 
* @namespace
* @property { string } brnNo - 机构号
* @property { string } tlrNo - 柜员号
* @property { string } tlrName - 柜员名称
* @property { string } tranDate -当前交易日期
*/
common.userInfo = {
	...JSONStr,
	brnNo: JSONStr.inst_no,
	tlrNo: JSONStr.tlr_no,
	tlrName: JSONStr.tlr_name,
	tranDate: JSONStr.tran_date
}

export default common;