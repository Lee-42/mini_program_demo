
/*
@字符串报文解析
@param keys 自定义表头，字符串数组，顺序要与值对应
@param msg 原报文
@return 解析后报文 json
*/
function fileStringToJson(txt, keys) {
	if (!keys) {
		console.error("表头输入错误");
		return;
	}
	let from1or0 = 0; //记录是否有表头
	if (txt.charAt(0) == "~") {
		txt = txt.substring(1, txt.length - 1);
		from1or0 = 1;
	}
	let lines = txt.split('\n');
	let res = [];
	for (let i = from1or0; i < lines.length; i++) {
		if (lines[i]) {
			let tmp = {};
			let values = lines[i].split("|");
			for (let j = 0; j < keys.length; j++) {
				tmp[keys[j]] = values[j];
			}
			res.push(tmp)
		}
	}
	return res;
}

//示例: txt1有表头 txt2无表头
// let txt1 = "~账户序号|开户日期|产品名称|账号余额|账号状态|冻结状态|支付状态|币种|钞汇标志|账户性质|存现标志|\n1|20231025|储蓄人民币活期|1,100.00|正常|正常|正常|人民币|钞户||Y|\n"
// let txt2 = "1|20231025|储蓄人民币活期|1,100.00|正常|正常|正常|人民币|钞户||Y|\n"
// let mykeys = ["seq_no", "open_date", "prd_name", "acct_bal", "acct_status", "frezz_status", "pay_staus", "curl",
// 	"cash_flag", "acct_type", "save_flag"
// ];
// console.log(fileStringToJson(txt1, mykeys))

var obj = {};
obj.fileStringToJson = fileStringToJson;

export default obj;