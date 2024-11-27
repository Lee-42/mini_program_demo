import { invoke as invokeAuthComponent } from "./authHook";
import "./gmcrypto_hmac32.js";

let api = {};

const env = Object.freeze({
  Dev: 'Dev',
  Test: 'Test',
  Prod: 'Prod'
})
const curEnv = window.sessionStorage.getItem("requestUrl") ? env.Prod : env.Dev

let baseUrl = window.sessionStorage.getItem("requestUrl") || "http://10.18.97.42:10082/"

let pubMap = {}

const isEncode = false;//是否通讯加密
let gmObj, pubKey, stm_token

//加密参数初始化
if (isEncode) {
  gmObj = new gmcrypto_hmac32.GMCrypto();
  pubKey = "040CC4CDF12D3BB6D5E82DF0769AB343C528080AAF678AAA43F89F0B60F01C63D0F353376421FCE11B577E3B97029851B6E0D970B88E83ADD1442141B58022FD2A";
  stm_token = gmObj.GenExportSessionKey(pubKey, true);
}

function getIp() {
  return new Promise((resolve, reject) => {
    nt.getSystemInfo({
      success: res => {
        let { ip, mac } = res
        resolve(`${ip};;${mac}`)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
let tmnlIp
getIp().then(res => {
  tmnlIp = res
})

function findcharN(str, cha, num) {
  var x = str.indexOf(cha);
  for (var i = 0; i < num; i++) {
    x = str.indexOf(cha, x + 1);
  }
  return x + 1;
}

//字符串转16进制
function stringToHex(str) {
  str = encodeURIComponent(str);
  var res = "";
  for (var i = 0; i < str.length; i++) {
    var charcode = str.charCodeAt(i).toString(16);
    res += charcode
  }
  return res;
}
//16进制转字符串
function HexToString(str) {
  var trimstr = str.trim();
  var rawstr = trimstr.substr(0, 2).toLowerCase() === "0x" ? trimstr.substr(2) : trimstr;
  var len = rawstr.length;
  var curcode;
  var res = [];
  for (var i = 0; i < len; i = i + 2) {
    curcode = parseInt(rawstr.substr(i, 2), 16);
    res.push(String.fromCharCode(curcode));
  }
  return decodeURIComponent(res.join(""));
}

function getPubMap() {
  // 获取登录接口返回的公共入参
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const tranCd = localStorage.getItem("tranCd");

  // 解构赋值
  let { inst_no, tlr_no, terminal_no } = userInfo;

  if (curEnv === env.Prod) {
    pubMap = {
      tranBrchNo: inst_no,
      tlrNo: tlr_no,
      tmnlNo: terminal_no,
      tmnlIp,
      tranCd
    }
  } else if (curEnv === env.Test) {
    pubMap = {
      tranBrchNo: "100003",
      tlrNo: "021017",
      tmnlNo: terminal_no,
      tranCd: "800206"
    }
  } else if (curEnv === env.Dev) {
    pubMap = {
      tranBrchNo: '461100',
      tlrNo: '101049',
      tmnlNo: '101049182005',
      tranCd,
    }
  }
}

/*
 * 公共请求方法
 * @param reqObj :业务入参 
 */


api.curEnv = curEnv
api.env = env
/**
 * 公共请求方法
 * @param reqObj :业务入参
 * @param { string } reqObj.url 请求接口地址 
 * @param { object } reqObj.data 业务入参 
 * @param { object } reqObj.options 其他配置项 
 * @param { object } reqObj.headers 特殊 headers 配置 
 * @param { string } reqObj.method 请求方法（post、get） 
 * @param { boolean } reqObj.auth 控制是否调用授权方案
 * */
api.request = (reqObj) => {
  if (typeof reqObj == "undefined" || !reqObj.url) {
    return;
  }
  if (reqObj.auth) {
    reqObj.data.check_auth = '1'
  }
  //预处理请求报文
  reqObj = preloadRequestData(reqObj, "reCtrl");
  if (isEncode) {
    //报文加密
    let requestStr = JSON.stringify(reqObj.data);
    let stm_message = gmObj.EncryptData(stringToHex(requestStr), true);
    //重组报文
    var codeData = {};
    codeData.sms_token = stm_token;
    codeData.requestInfo = stm_message;
    reqObj.data = codeData;
  }
  nt.request({
    method: reqObj.method,
    headers: reqObj.headers,
    dataType: reqObj.dataType,
    url: reqObj.url,
    data: reqObj.data,
    // 成功回调
    success: (res) => handleResponse(res, reqObj),
    // 失败回调
    fail: (err) => handleFailure(err, reqObj),
    complete: () => {
      if (reqObj.complete) {
        reqObj.complete();
      }
    },
  });
};
// 下载请求
api.downloadFile = (reqObj) => {
  if (typeof reqObj == "undefined" || !reqObj.url) {
    console.log("请求路径错误");
    return;
  }
  reqObj = preloadRequestData(reqObj, "downCtrl");
  nt.downloadFile({
    method: reqObj.method,
    headers: reqObj.headers,
    dataType: reqObj.dataType,
    url: reqObj.url,
    data: reqObj.data,
    fileName: reqObj.fileName,
    // 成功回调
    success: (res) => handleResponse(res, reqObj),
    // 失败回调
    fail: (err) => handleFailure(err, reqObj),
    complete: () => {
      if (reqObj.complete) {
        reqObj.complete();
      }
    },
  });
};

// 上传请求
api.uploadFile = (reqObj) => {
  if (typeof reqObj == "undefined" || !reqObj.url) {
    return;
  }
  reqObj = preloadRequestData1(reqObj, "upCtrl");
  console.log(`reqObj:`, reqObj);
  nt.uploadFileByChoose({
    method: reqObj.method,
    headers: reqObj.headers,
    dataType: reqObj.dataType,
    url: reqObj.url,
    formData: reqObj.formData,
    data: reqObj.data,
    // 成功回调
    success: (res) => handleResponse(res, reqObj),
    // 失败回调
    fail: (err) => handleFailure(err, reqObj),
    complete: () => {
      if (reqObj.complete) {
        reqObj.complete();
      }
    },
  });
};

// 函数：处理请求结果
function handleResponse(res, reqObj) {
  //报文解密
  if (isEncode) {
    let restext = escape(window.atob(res.data));
    let desMessage = gmObj.DecryptData(restext, true);
    desMessage = decodeURIComponent(
      HexToString(desMessage).replace(/\+/g, "%20"),
      "utf-8"
    );
    res.data = JSON.parse(desMessage);
  }

  //判断是否需要授权
  if (res.data.auth_id) {
    const { auth_seq, auth_lvl } = res.data.needPermissionArray[0]
    invokeAuthComponent({
      auth_id: res.data.auth_id,
      auth_seq,
      level: auth_lvl,
      success: () => {
        reqObj.data.auth_id = res.data.auth_id;
        api.request(reqObj);
      },
      fail: reqObj.fail,
    })
  } else {
    reqObj.success(res);
  }
  nt.log({
    type: "info",
    data: JSON.stringify(res),
  });
}

// 函数：处理请求失败
function handleFailure(err, reqObj) {
  nt.log({
    type: "error",
    data: JSON.stringify(err),
  });
  //有传失败回调,就交给回调处理
  if (reqObj.fail) {
    reqObj.fail(err);
    return;
  }
  // const errMsg =  `暂时未能处理您的请求，请稍后再试。技术错误码为：${err.message}`
  // 没有失败回调，统一提示
  const errMsg =
    err.response && err.response.data
      ? `${err.response.data.errMsg}, 请求流水号: ${err.response.data.flowNo}`
      : err.message;
  nt.alert(`暂时未能处理您的请求，请稍后再试。技术错误码为：${errMsg}`);
}
/**
 *
 * 用于替换地址
 * 用于上传请求
 */
function preloadRequestData1(obj, ctrlType) {
  let url = "";
  if (obj.url.indexOf("http") >= 0) {
    //如果传入的地址有ip，替换ip
    url =
      baseUrl + obj.url.substring(findcharN(obj.url, "/", 2), obj.url.length);
  } else {
    // url = baseUrl + "/counterSystem/reCtrl/" + obj.url;
    url = `${baseUrl}counterSystem/${ctrlType}/${obj.url}`;
  }
  if (!obj.method) {
    obj.method = "POST";
  }
  obj.url = url;
  getPubMap();
  //   测试的时候注释掉，打包的时候记得打开注释 (>_<)!!!
  pubMap.reqFlowNo = window.reqFlowNo || window?.frameElement?.getAttribute('reqflowno');
  const { pswdKeyFlag, pswdDeviceNo } = JSON.parse(localStorage.getItem("pwdDeviceInfo")) || {}
  pubMap.pswdKeyFlag = pswdKeyFlag
  pubMap.pswdDeviceNo = pswdDeviceNo
  //   用于后端解析pubMap
  let temp = JSON.stringify(pubMap);
  temp = `${temp};type=application/json`;
  obj.formData = {
    pubMap: temp,
    ...obj.formData,
  };
  return obj;
}
/**
 *
 * 用于替换地址
 * 用于下载和普通请求
 */
function preloadRequestData(obj, ctrlType) {
  let url = "";
  if (obj.url.indexOf("http") >= 0) {
    //如果传入的地址有ip，替换ip
    url =
      baseUrl + obj.url.substring(findcharN(obj.url, "/", 2), obj.url.length);
  } else {
    // url = baseUrl + "/counterSystem/reCtrl/" + obj.url;
    url = `${baseUrl}counterSystem/${ctrlType}/${obj.url}`;
  }
  if (!obj.method) {
    obj.method = "POST";
  }
  obj.url = url;
  //   测试的时候注释掉，打包的时候记得打开注释 (>_<)!!!
  getPubMap()
  pubMap.reqFlowNo = window.reqFlowNo || window?.frameElement?.getAttribute('reqflowno');
  const { pswdKeyFlag, pswdDeviceNo } = JSON.parse(localStorage.getItem("pwdDeviceInfo")) || {}
  pubMap.pswdKeyFlag = pswdKeyFlag
  pubMap.pswdDeviceNo = pswdDeviceNo

  obj.data = {
    pubMap,
    ...obj.data,
  };

  if (obj.pubMap) {
    Object.assign(obj.data.pubMap, obj.pubMap)
  }

  return obj;
}

api.getCommonAddress = () => {
  return baseUrl;
}

// const showAuth = (authData) => {
//   authData = authData.data;
//   let needPermissionArray = authData.needPermissionArray;
//   let html = `<div>
// 		   授权柜员号&nbsp;<input id="comAuthUserid1"  style="height:30px;padding-left:5px;width:80px"/>
// 			&nbsp;<span id="comAuthUserid1_tips">需要级别${needPermissionArray[0].auth_lvl}以上人员授权</span>
// 		</div>
// 		<div style="margin-top:10px">
// 		   密码或指纹&nbsp;<input id="comAuthUserid1_pwd" type="password" style="height:30px;padding-left:5px" onblur="window.checkUser()"/>
// 			&nbsp;<span id="comAuthUserid1_auth_tips"></span>
// 		</div>
// 		`;

//   let title = ``;
//   nt.messageBox({
//     "title": '请授权',
//     "showConfirmButton": true,
//     // "showCancelButton": true,
//     dangerouslyUseHTMLString: true,
//     customClass: "auth",
//     draggable: true,
//     beforeClose: (action, instance, done) => {
//       console.log(action);
//       if (action == "close" || action == "cancel") {
//         window?.authReqData?.fail && window.authReqData.fail();
//         done();
//       }
//       if (action == "confirm") {
//         //授权后带上authid 重发交易
//         if (
//           document
//             .getElementById("comAuthUserid1_auth_tips")
//             .innerHTML.indexOf("成功") >= 0
//         ) {
//           window.authReqData.data.auth_id = window.nowAuth.auth_id;
//           api.request(window.authReqData);
//           done();
//         }
//       }
//     },
//     "message": html
//   })

// }


// window.checkUser = (e) => {
//   api.request({
//     // url: "authlog003",
//     url: "updateAuthlogForTxAuth",
//     data: {
//       userid: document.getElementById("comAuthUserid1").value,
//       entry_pwd: document.getElementById("comAuthUserid1_pwd").value,
//       auth_id: window.nowAuth.auth_id,
//       auth_seq: window.nowAuth.needPermissionArray[0].auth_seq,
//       auth_teller: document.getElementById("comAuthUserid1").value,
//       self_enable: "0",
//     },
//     success: (res) => {
//       document.getElementById('comAuthUserid1_auth_tips').innerHTML = res.data.data.msg;
//     },
//     fail: (err) => {
//       document.getElementById('comAuthUserid1_auth_tips').innerHTML =
//         `<span style="color:red">${err.response.data.errMsg}</span>`;
//     }
//   });
// }

export default api;