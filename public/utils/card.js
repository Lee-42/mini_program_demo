


// type：类型
// cardVal: 证件号码
/**
 * 根据传入的证件类型，进行证件号码有效性校验
 * @param {String} type：类型
 * @param {String} cardVal: 证件号码
 * @returns { retCd: true, retMsg: '' }
 */

let data = {
    retCd: false,
    retMsg: ''
}
const cardVerifyRule = (type, cardVal) => {
    // 1.身份证（1）、临时身份证（E）、港澳居民居住证（W）、台湾居民居住证（Y）必须为18位，否则提示“N003-该证件号码应为18位，请检查”，证件号码格式必须有效(核心K020接口)，否则提示“N002-证件号码无效，请检查”
    if (['1', 'E', 'W', 'Y'].includes(type)) {
        if (cardVal.length == 18) {
            return checkIdCardNumber(cardVal)
        } else {
            return { retCd: false, retMsg: 'N003-该证件号码应为18位，请检查' }
        }

    }

    // 2.外国人永久居留身份证（F）必须为15或18位，否则提示“该证件的长度必须为15位或18位”
    if (type == 'F' && (cardVal.length != 15 && cardVal.length != 18)) return { retCd: false, retMsg: '该证件的长度必须为15位或18位' }

    // 3.港澳居民来往通行证（7）必须为9位，否则提示“该证件的长度必须为9位”；该证件必须以H或M开头，否则提示“该证件必须以M或H开头”
    if (type == '7') {
        if (cardVal.length != '9') return { retCd: false, retMsg: '该证件的长度必须为9位' }
        if (!cardVal.startsWith('H') && !cardVal.startsWith('M')) return { retCd: false, retMsg: '该证件必须以M或H开头' }
    }

    // 4.台湾同胞来往通行证（I）必须为7位或8位，否则提示“该证件的长度必须为7位或8位”
    if (type == 'I' && (cardVal.length != 7 && cardVal.length != 8)) return { retCd: false, retMsg: '该证件的长度必须为7位或8位' }

    // 5.组织机构代码证（8）格式必须有效(核心K020接口)，否则提示否则提示“N002-证件号码无效，请检查”
    if (type == '8') {
        return checkOrganzation(cardVal)
    }

    //6.统一信用代码 （A营业执照）
    if (type == 'A') {
        return chackCharacter(cardVal)
    }

    return { retCd: true, retMsg: '' }
}


// 身份证校验
function checkIdCardNumber(idcard) {
    let Errors = [
        // {code:0, status: true, msg: '验证通过!' },
        // {code:1, status: false, msg: '身份证号码位数不对!' },
        // {code:2, status: false, msg: '身份证号码出生日期超出范围或含有非法字符!' },
        // {code:3, status: false, msg: '身份证号码校验错误!' },
        // {code:4, status: false, msg: '身份证地区非法!' },
        true,
        false,
        false,
        false,
        false,
    ];
    let area = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外",
    };
    let ereg;
    let idcard_array = idcard.split("");

    if (area[parseInt(idcard.substr(0, 2))] === null) return { retCd: false, retMsg: 'N002-证件号码无效，请检查' }
    switch (idcard.length) {
        case 18:
            if (
                parseInt(idcard.substr(6, 4)) % 400 == 0 ||
                (parseInt(idcard.substr(6, 4)) % 100 != 0 &&
                    parseInt(idcard.substr(6, 4)) % 4 == 0)
            ) {
                ereg =
                    /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;
                //闰年出生日期的合法性正则表达式
            } else {
                ereg =
                    /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;
                //平年出生日期的合法性正则表达式
            }
            if (ereg.test(idcard)) {
                let S =
                    (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 +
                    (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 +
                    (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 +
                    (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 +
                    (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 +
                    (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 +
                    (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 +
                    parseInt(idcard_array[7]) * 1 +
                    parseInt(idcard_array[8]) * 6 +
                    parseInt(idcard_array[9]) * 3;
                let Y = S % 11;
                let M = "F";
                let JYM = "10X98765432";
                M = JYM.substr(Y, 1);
                if (M == idcard_array[17]) return { retCd: true, retMsg: '' };
                else return { retCd: false, retMsg: 'N002-证件号码无效，请检查' }
            } else return { retCd: false, retMsg: 'N002-证件号码无效，请检查' }
        default:
            return { retCd: false, retMsg: 'N002-证件号码无效，请检查' }
    }
}

// 组织机构代码
function checkOrganzation(cardVal) {
    var orgnos = cardVal.replace("-", "");
    var orgno = [orgnos.slice(0, 8), orgnos.slice(8)];
    var factor = new Array(3, 7, 9, 10, 5, 8, 4, 2);
    var s = 0;
    var tmp = 0;
    var strAscii = new Array();// 
    for (var i = 0; i < factor.length; i++) {
        //把字符串中的字符一个一个的解码
        tmp = orgno[0].charCodeAt(i);
        if (tmp >= 48 && tmp <= 57) {
            strAscii[i] = tmp - 48;
        } else if (tmp >= 65 && tmp <= 90) {
            strAscii[i] = tmp - 55;
        } else {
            strAscii[i] = tmp;
        }
        //乘权重后加总
        s += factor[i] * strAscii[i];
    }
    var C9 = 11 - (s % 11);
    var YC9 = orgno[1] + '';
    //var YC9 = orgNo.substring(8,9)+'';
    if (C9 == 11) { C9 = '0'; }
    else if (C9 == 10) { C9 = 'X'; }
    else { C9 = C9 + ''; }

    if (C9 != YC9) {
        // alert("组织机构代码不合法！");
        return { retCd: false, retMsg: 'N002-证件号码无效，请检查' }
    }

    return { retCd: true, retMsg: '' }
}

// 统一信用社会代码
function chackCharacter(param1) {
    // var param1 = document.getElementById('character26').value;
    if (param1 != "" && param1 != null) {
        var zzz = param1.substring(0, 2);//前两位
        var zz = /^((1?[1|2|3|9])|(5?[1|2|3|9])|(9?[1|2|3|9])|[2|3|4|6|7|8|A-G|Y][1])$/;//前两位正则
        var xzqh = new Array("11", "12", "13", "14", "15", "21", "22", "23", "31", "32", "33", "34", "35", "36", "37", "41", "42", "43", "44", "45", "46", "50", "51", "52", "53", "54", "61", "62", "63", "64", "65", "71", "81", "82", "91");
        var aera2 = param1.substring(2, 4);;//行政区划前两位
        var aera = param1.substring(2, 8);;//行政区划
        var zzaera = /^([0-9])*$/;//行政区划正则
        var orgNo1 = param1.substring(8, 16) + "-" + param1.substring(16, 17);//组织机构代码
        var qhbz = 0;
        var re = /^([0-9A-Z]{8}\-[\d{1}|X])$/;//组织机构代码正则
        for (var g = 0; g < xzqh.length; g++) {
            if (xzqh[g] == aera2) {
                qhbz = 1;
            }
        }
        if (!zz.test(zzz)) {
            //前两位匹配
            // alert("统一社会信用代码不符合规范！");
            return { retCd: false, retMsg: '统一社会信用代码不符合规范！' }
        } else if (qhbz == 0) {
            // alert("统一社会信用代码不符合规范！");
            return { retCd: false, retMsg: '统一社会信用代码不符合规范！' }
        } else if (!zzaera.test(aera)) {
            //行政区划匹配
            // alert("统一社会信用代码不符合规范！");
            return { retCd: false, retMsg: '统一社会信用代码不符合规范！' }
        } else if (!re.test(orgNo1)) {
            ///组织机构代码匹配
            // alert("统一社会信用代码不符合规范！");
            return { retCd: false, retMsg: '统一社会信用代码不符合规范！' }
        } else {
            var orgno = orgNo1.split("-");
            var factor = new Array(3, 7, 9, 10, 5, 8, 4, 2);
            var s = 0;
            var tmp = 0;
            var strAscii = new Array();// 
            for (var i = 0; i < factor.length; i++) {
                //把字符串中的字符一个一个的解码
                tmp = orgno[0].charCodeAt(i);
                if (tmp >= 48 && tmp <= 57) {
                    strAscii[i] = tmp - 48;
                } else if (tmp >= 65 && tmp <= 90) {
                    strAscii[i] = tmp - 55;
                } else {
                    strAscii[i] = tmp;
                }
                //乘权重后加总
                s += factor[i] * strAscii[i];
            }
            var C9 = 11 - (s % 11);
            var YC9 = orgno[1] + '';
            //var YC9 = orgNo.substring(8,9)+'';
            if (C9 == 11) { C9 = '0'; }
            else if (C9 == 10) { C9 = 'X'; }
            else { C9 = C9 + ''; }
            if (YC9 == C9) {


                var jq = new Array(1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28);//加权因子
                var m =
                    new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30); //到吗字符集

                var h =
                    new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "T", "U", "W", "X", "Y");
                var num = 0;

                var jym = "";
                var zzjgdm = param1.substring(0, 17);
                var last = param1.substring(17);
                for (var i = 0; i < 17; i++) {
                    var zf = zzjgdm.substring(i, i + 1);
                    for (var r = 0; r < h.length; r++) {
                        if (zf == (h[r])) {
                            num += jq[i] * m[r];
                        }
                    }

                }

                var yu = 31 - (num % 31);
                if (yu == 31) {
                    yu = 0;
                }
                //	System.out.println("yu" + yu);
                for (var v = 0; v < m.length; v++) {
                    if (yu == m[v]) {
                        jym = h[v];
                        //alert(jym);
                    }
                }
                if (last != jym) {
                    // alert("统一社会信用代码不符合规范！");
                    return { retCd: false, retMsg: '统一社会信用代码不符合规范！' }
                }
                // else {
                //     // alert(param1 +
                //     //     "\r\n统一社会信用代码合法！");
                //     // return (new Error(param1 + '\r\n统一社会信用代码不符合规范！'));
                // }

            } else {
                ///组织机构代码匹配
                // alert("统一社会信用代码不符合规范！");
                return { retCd: false, retMsg: '统一社会信用代码不符合规范！' }
            }
        }

        return { retCd: true, retMsg: '' }
    }
}

const card = {
    cardVerifyRule
}

export default card

