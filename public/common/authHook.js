// import { defineComponent, defineAsyncComponent, createVNode, render, h } from 'vue';
// const AuthComponent = defineAsyncComponent(() => import("../components/AuthDialog/index.vue"));
// import AuthComponent from "../components/AuthDialog/index.vue"
import api from "../common/api";

const generateDialogBox = ({ auth_id, auth_seq, level, onConfirm, onClose }) => {
  let pass = false;
  let tlr_sign = ""; // 授权方式
  let finger_pwd_1 = ""; // 指纹数据

  const showTip = (errmsg) => {
    console.error(errmsg);
    document.querySelector(".auth-tip").innerHTML = errmsg;
  }

  const openPwdDevice = () => {
    nt.confirm('是否打开指纹仪获取指纹？', {
      type: 'info',
      confirmButtonText: "是",
      cancelButtonText: "否"
    }).then((res) => {
      if (res === "confirm") {
        NTDev.fingerPrint.FPIGetFeature(0, 10000, async (lpFinger, lpImage, lpImageLen) => {
          console.log("指纹：", lpFinger);
          finger_pwd_1 = lpFinger;
        });
      }
    });
  }

  // 校验账号
  const checkUserId = (event) => {
    const value = event.target.value;
    if (!value) {
      return nt.showMessagebox("请输入授权柜员号", "授权失败", {
        info: "error",
        beforeClose: (action, _instance, done) => {
          done();
          setTimeout(() => {
            event.target.focus();
          }, 200);
        }
      });
    }
    api.request({
      url: "listTellers",
      data: {
        tlr_no: value,
        page: 1,
        rows: 10,
      },
      success: (response) => {
        const data = response.data.data.data;
        if (data.length) {
          const userInfo = data[0];
          tlr_sign = userInfo.tlr_sign;

          // 禁用密码输入框
          const disabledPwdInput = () => {
            const pwd = document.querySelector("#comAuthPwd");
            pwd.setAttribute("readonly", "true");
          }
          // 恢复密码输入框
          const enabledPwdInput = () => {
            const pwd = document.querySelector("#comAuthPwd");
            pwd.removeAttribute("readonly");
          }

          // 直接判断是否读取指纹 1,4-指纹；2,5-密码；3-指纹或密码；
          if (tlr_sign === "1" || tlr_sign === "4") {
            disabledPwdInput();
            openPwdDevice();
          } else if (tlr_sign === "3") {
            enabledPwdInput();
            openPwdDevice();
          } else {
            enabledPwdInput();
          }
        } else {
          nt.showMessagebox("该柜员不存在", "温馨提示", {
            type: 'info',
            confirmButtonText: '知道了',
            beforeClose: (action, _instance, done) => {
              done();
              setTimeout(() => {
                event.target.focus();
              }, 200);
            }
          })
        }
      },
      fail: (err) => {
        nt.showMessagebox(err.response.data.errMsg || "系统错误", "授权失败", {
          info: "error",
        })
      }
    })
  }

  // 校验密码
  const checkUser = (event) => {
    const userid = document.getElementById("comAuthUserid").value;
    const value = event.target.value;

    switch (tlr_sign) {
      case "1":
      case "4":
        if (!finger_pwd_1) {
          showTip("授权缺少指纹数据");
          return
        }
        break;
      case "2":
      case "5":
        if (!value) {
          showTip("请输入密码");
          return
        }
        break;
      case "3":
        if (!finger_pwd_1 && !value) {
          showTip("请采集指纹或者输入密码");
          return
        }
        break;
      default:
        return;
    }

    api.request({
      url: "updateAuthlogForTxAuth",
      data: {
        userid,
        entry_pwd: value,
        auth_id,
        auth_seq,
        auth_teller: userid,
        self_enable: "0",
        finger_pwd_1: encodeURIComponent(finger_pwd_1),
      },
      success: (res) => {
        if (/成功/.test(res.data.data.msg)) {
          pass = true;
          showTip("");
        } else {
          showTip(res.data.data.msg || "系统错误");
        }
      },
      fail: (err) => {
        showTip(err.response.data.errMsg || "系统错误");
      }
    });
  };

  const onAccountEnter = (e) => {
    checkUserId(e);
  }

  // 只要柜员号有在输入，则清空之前的错误信息
  const onAccountInput = (e) => {
    const txt = document.querySelector(".auth-tip");
    if (txt.innerHTML) {
      txt.innerHTML = "";
    }
  }

  // const onPwdEnter = (e) => {
  //   if (e.keyCode === 13) {
  //     checkUser(e);
  //   }
  // }

  // 绑定事件
  const bindingEvents = () => {
    // 绑定柜员号事件
    const account = document.querySelector("#comAuthUserid");
    if (account) {
      account.addEventListener("blur", onAccountEnter);
      account.addEventListener("input", onAccountInput);
    }
    // 绑定密码输入框事件
    const pwd = document.querySelector("#comAuthPwd");
    if (pwd) {
      pwd.addEventListener("blur", checkUser);
    }
  };
  // 解绑事件
  const offEvents = () => {
    const account = document.querySelector("#comAuthUserid");
    if (account) {
      account.removeEventListener("blur", onAccountEnter);
      account.removeEventListener("input", onAccountInput);
    }
    const input = document.querySelector("#comAuthPwd");
    if (input) {
      input.removeEventListener("blur", checkUser);
    }
  }

  let html = `<div style="line-height: 1;">
  <div class="header" style="font-size:18px;font-weight:bold;">请授权</div>
  <div class="tip" style="margin:16px 0;font-size:12px;color:#999;display:flex;;align-items:center;">
    <span class="icon" style="margin-right:4px;display:inline-block;width:12px;height:12px;background-color:orange;border-radius:50%;text-align:center;color:#fff;">!</span>
    需要级别${level}以上人员授权
  </div>
  <div style="display:flex;align-items:center;margin-bottom:16px;">
    <span style="margin-right:8px;width: 46px;text-align:right;">柜员号</span>
    <input style="border-radius:var(--nt-border-radius-base);padding:6px;line-height:1.4;outline:0;border:none;background:0 0;width:200px;box-shadow: 0 0 0 1px var(--nt-border-color) inset;" id="comAuthUserid" maxlength="6" placeholder="请输入授权柜员号" myAutoFocus="auth-dialog" />
  </div>
  <div style="display:flex;align-items:center;margin-bottom:16px;">
    <span style="margin-right:8px;width: 46px;text-align:right;">密码</span>
    <div style="position:relative;">
      <input style="border-radius:var(--nt-border-radius-base);padding:6px;line-height:1.4;outline:0;border:none;background:0 0;width:200px;box-shadow: 0 0 0 1px var(--nt-border-color) inset;" id="comAuthPwd" type="password" maxlength="6" placeholder="请输入密码"  />
      <div style="color:var(--nt-color-danger);font-size:12px;line-height:1;padding-top:2px;position:absolute;top:100%;left:0;" class="auth-tip"></div>
    </div>
  </div>
</div>`;

  nt.messageBox({
    "showConfirmButton": true,
    "showCancelButton": true,
    dangerouslyUseHTMLString: true,
    customClass: "auth",
    beforeClose: (action, _instance, done) => {
      if (action == "close" || action == "cancel") {
        onClose && onClose({ chnlRetCd: "-1", chnlMsgInfo: "授权已取消", errMsg: "授权已取消" });
        offEvents();
        done();
      }
      else if (action == "confirm") {
        if (pass) {
          onConfirm && onConfirm();
          offEvents();
          done();
        } else {
          showTip("未进行授权");
        }
      }
    },
    "message": html
  });

  setTimeout(() => {
    // 控制焦点
    const input = document.querySelector("#comAuthUserid[myautofocus=auth-dialog]")
    if (input) {
      input.focus()
    }
    bindingEvents();
  }, 1000);
}

// 定义父盒子蒙层
// const renderComponent = ({ auth_id, auth_seq, level }) => {
//   return defineComponent({
//     emits: ["close", "confirm"],
//     render(ctx) {
//       return h(
//         "div",
//         {
//           style: {
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             "z-index": 9, // 高于普通页面，低于弹窗
//             backgroundColor: "rgba(0,0,0,0.5)",
//           },

//         },
//         // NOTE，为了避免触发父盒子的销毁事件，组件内的所有点击事件请使用stop修饰符
//         h(AuthComponent, {
//           level,
//           auth_id,
//           auth_seq,
//           onConfirm: () => {
//             ctx.$emit("confirm");
//           },
//           onCancel: () => {
//             ctx.$emit("close");
//           },
//         })
//       )
//     }
//   });
// }

/**
 * 创建并挂载授权弹窗蒙层
 * @param {object} props 选项配置
 * @param {string} props.auth_id 授权ID，由接口返回
 * @param {string} props.auth_seq 授权识别号，由接口返回
 * @param {number|string} props.level 所需授权等级，由接口返回
 * @param {function} props.success 授权弹窗点击确定按钮的回调
 * @param {function} props.fail 授权弹窗点击取消按钮的回调
 * @returns {Vnode} VNODE实例
 * @description 提供授权弹窗的API式调用
 */
const invoke = (props) => {
  if (typeof props === "object") {
    const { auth_id, auth_seq, level = 1 } = props
    if (!auth_id || !auth_seq) {
      return
    }

    // 由于柜面无法使用 defineAsyncComponent + render，所以使用 html + nt.messagebox + 新版焦点控制的形式
    generateDialogBox({ auth_id, auth_seq, level, onConfirm: props.success, onClose: props.fail });

    // 创建实例
    // const div = document.createElement("div");
    // const vnode = createVNode(renderComponent({ auth_id, auth_seq, level }));
    // render(vnode, div);
    // const el = div.firstElementChild;

    // // 挂载实例
    // document.body.appendChild(el);

    // const destroy = () => {
    //   document.body.removeChild(el);
    //   render(null, div);
    // }

    // 绑定销毁函数
    // vnode.props = {
    //   onConfirm: () => {
    //     destroy();
    //     props.success && props.success();
    //   },
    //   onClose: () => {
    //     destroy();
    //     props.fail && props.fail();
    //   },
    // }

    // 抛出实例
    // return vnode;
  }
}

export { invoke } 