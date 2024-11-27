/* public\components\onlinecheck\onlinecheck.js */
import util from "../../utils/utils";
import request from '../../utils/request'
import commonData from "../../common/common";
import NTDevUtils from "../../common/NTDevUtils";
import common from "../../common/index";

Component({
  data: {
    formModel: {
      checkNo: "",
      checkName: "",
      checkType: "",
      checkReason: "",
    },
    checkCode: -1,
    resultData: {
      resultCode: null,
      checkDepartment: null,
      checkName: null,
      checkNo: null,
      avatar: null,
      phtImage: null, // 云端文件名
    },
    ocrData: {
      avatar: null,
      ocrType: null,
      smDgrRto: null,
      smDgrRtoRslt: null,
    },

    checkReasonType: [
      { value: "01", label: "银行账户业务" },
      { value: "02", label: "信贷及征信" },
      { value: "03", label: "支付结算" },
      { value: "04", label: "反洗钱" },
      { value: "05", label: "其他" },
    ],
    checkResultOptions: [],
  },
  properties: {
    modelValue: Boolean,
    // 联网核查数据源类型 common - 本人身份核查， agent - 代理人身份核查
    // 核查之后，数据会保存在客户试图组件中，每次核查时，根据数据源提示是否使用原核查数据
    storageFrom: { type: String, default: "common" },
    checkName: String,
    checkIDNo: String,
    idCardAvatar: { type: String, require: false }, // 证件图片，通过外设读取
    showReasonField: Boolean,
    formAttr: { type: Object, default: () => ({}) },
    isReadIdCardByDevice: { type: Boolean, default: false }, // 身份证号是否是通过设备读取
    mainCd: { type: String, require: true },
    noConfirm: Boolean, // 是否提示复用联网核查数据，不提示则直接反显
  },
  computed: {
    idCardAvatarPath() {
      return this.data.idCardAvatar ? `data:image/jpg;base64,${this.data.idCardAvatar}` : ""
    }
  },
  //生命周期
  created() {
    //created(函数只执行一次)
  },
  async ready() {
    //节点加载完成(函数只执行一次)
    if (this.data.checkIDNo) {
      this.data.formModel.checkNo = this.data.checkIDNo;
    }
    if (this.data.checkName) {
      this.data.formModel.checkName = this.data.checkName;
    }
    // 核查结果
    await util.getSelectData({
      mainCd: this.data.mainCd,
      flg: commonData.SelectDataType.C031,
      name: "checkResultOptions",
      that: this,
    });

    setTimeout(this.setFocus, 800);
  },
  attached() {
    // activated
  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {
    setFocus() {
      // 控制焦点 - 使用dialog装载时，请使用 append-to-body 属性
      const inputs = document.querySelectorAll(".nt-input__inner[myautofocus=online-check]")
      if (inputs && inputs.length) {
        inputs[inputs.length - 1].focus()
      }
    },
    resetResult() {
      this.setData({
        checkCode: -1,
        resultData: {
          resultCode: null,
          checkDepartment: null,
          checkName: null,
          checkNo: null,
          avatar: null,
          phtImage: null,
        },
      });
    },
    async onSubmitCheck() {
      // 发送
      try {
        const res = await request.post("c001esb", {
          bsnKndTp: this.data.formModel.checkType, // 业务种类
          idtyCrdNo: this.data.formModel.checkNo, // 身份证号
          nm: this.data.formModel.checkName, // 客户名称
          chkMd: this.data.isReadIdCardByDevice ? "10" : "11", // 检查方式
          sndRmk: "0", // 发送0-人行或1-公安标志 默认 0
          tranCd: localStorage.getItem("tranCd") || "public"
        }, {
          pubMap: { tranCd: localStorage.getItem("tranCd") || "public" }
        });
        console.log("🚀 ~ c001 ~ res:", res);

        if (res && res.chkCd) {
          // 保存核查数据
          this.setData({
            resultData: {
              resultCode: res.chkCd,
              checkDepartment: res.issuAthry,
              checkName: res.nm,
              checkNo: this.data.formModel.checkNo,
              avatar: `data:image/jpg;base64,${res.fileData}`,
              phtImage: res.phtImage,
            },
          });
        };
      } catch (error) {
        console.error(error);
        this.resetResult();
      }
    },

    handleprint() { },

    // 关闭按钮：表示跳过联网核查，询问是否继续
    async handleClose() {
      // 未进行人脸比对，或 人脸对比失败时 弹出提示
      if (this.data.ocrData.smDgrRto === null || this.data.ocrData.smDgrRtoRslt !== "成功") {
        const goOn = await new Promise(resolve => {
          nt.showMessagebox('联网身份核查和人脸比对未通过，是否关闭并继续交易？', '交易暂停', {
            type: 'error',
            showCancelButton: true,
            confirmButtonText: '关闭并继续',
            cancelButtonText: '取消',
            beforeClose: (action, _instance, done) => {
              if (action === 'confirm') {
                resolve(1)
              } else {
                resolve(0)
              }
              done();
            }
          });
        });
        if (goOn === 1) {
          // 关闭联网核查，返回结果（联网核查通过）
          this.setData({
            checkCode: 0,
          });

          this.$emit("update:modelValue", false);
        }
      } else {
        this.$emit("update:modelValue", false);
      }
    },

    // 无论是点击返回或者ESC和点击关闭按钮，都会触发本方法
    onDialogClose() {
      if (this.data.checkCode === 0) {
        const result = {
          checkCode: 0,
          checkData: { ...this.data.resultData },
        }
        // 核查成功，缓存全局
        sessionStorage.setItem(`onlinecheck_data_${this.data.storageFrom}`, JSON.stringify(result))

        if (this.data.storageFrom === "common") {
          console.log("postmessageing...");
          // 本人核查，通知客户试图
          nt.postMessage("customerViewListener", {
            api: "setCustomerInfo",
            data: {
              cstNm: result.checkData.checkName,
              cstNo: "000000", // 联网核查没有客户号，用6个零作为联网核查标识
              identTp: "1",
              identNo: result.checkData.checkNo,
              avatar: result.checkData.avatar || this.data.idCardAvatarPath,
            }
          });
        }

        this.$emit("check", result);
      } else {
        this.$emit("check", {
          checkCode: this.data.checkCode,
          checkData: null,
        });
      }
    },

    onAccountChange(_, value, callback) {
      // 与需要校验的身份证不一致
      if (value !== this.data.checkIDNo) {
        this.resetResult();
      }
      callback(true);
    },

    // 点击拍照，打开摄像头并拍照
    handleCamera() {
      NTDevUtils.getCamera.quickCapture("sec", (url) => {
        console.log("NTDevUtils.getCamera.quickCapture", url);
        this.data.ocrData.avatar = url;
      })
    },
    // 点击对比
    async handleCompare() {
      const { checkNo, checkName, phtImage } = this.data.resultData;
      let avatar = phtImage;

      if (!avatar) {
        // 如果人行没有返回照片，则先把本地读取到的照片上传至服务器
        if (this.data.idCardAvatar) {
          await new Promise((resolve, reject) => {
            common.uploadFile({
              url: "uploadFile",
              formData: {
                file: util.dataURLtoBlob(this.data.idCardAvatarPath),
                fileName: `file_${Date.now()}.jpg`,
                tranCd: localStorage.getItem("tranCd") || "public", // formdata请求参数
              },
              success: (res) => {
                if (
                  res.data.status === "0" &&
                  res.data.data &&
                  res.data.data.pubMap &&
                  (res.data.data.pubMap.chnlRetCd === "0000")
                ) {
                  avatar = res.data.data.fileName;
                  resolve();
                } else {
                  reject();
                }
              },
              fail: reject,
            });
          })
        } else {
          // 如果连本地也没有照片，则无法对比
          nt.showMessagebox('缺少身份照片，无法进行对比！', '拒 绝', {
            type: 'error',
            confirmButtonText: '我知道了',
          });
          return
        }
      }

      // 上传高拍仪照片
      nt.uploadFile({
        url: "/counterSystem/upCtrl/uploadFile",
        formData: {
          tranCd: localStorage.getItem("tranCd") || "public", // formdata请求参数
        },
        filePath: this.data.ocrData.avatar.replace("file://", ""), // 指定文件路径 支持数组格式多个本地文件路径
        success: async (response) => {
          console.log("nt.uploaFile-response", response);
          if (
            response.status === "0" &&
            response.data &&
            response.data.pubMap &&
            (response.data.pubMap.chnlRetCd === "0000")
          ) {
            try {
              const res = await request.post("fc01", {
                identNo: checkNo, // 证件号码
                cstNm: checkName, // 姓名
                identTp: "0200", // 证件类型
                faceImg: response.data.fileName, // 人脸图片
                imgTp: "0301", // 图片类型
                arvlFbdFlg: "0", // 是否走人行接口
                cstAttr: "0500", // 客户属性
                acctNo: "", // 银行卡号
                idtyCrdFaceImgData: avatar, // 身份证图片
                tranCd: localStorage.getItem("tranCd") || "public", // 交易号
              }, {
                pubMap: { tranCd: localStorage.getItem("tranCd") || "public" }
              })
              const {
                smDgrRto, // 相似度
                smDgrRtoRslt, // 1 - 通过、? -失败、? -需人工审核
                imgSeqNo, // 图片流水号
                nwChkPht, // 联网核查照片
                cmprMd, // 比对方式：0 - 现场和底库比对 1 - 现场和人行比对 2 - 现场和身份证照片比对
              } = res

              Object.assign(this.data.ocrData, {
                // ocrType: null,
                smDgrRto,
                smDgrRtoRslt: smDgrRtoRslt === "1" ? "成功" : "失败",
              })

              // 对比成功
              if (smDgrRtoRslt === "1") {
                this.setData({
                  checkCode: 0,
                });
              }

              nt.alert("对比完成，请查看结果");
            } catch (error) {
              // 人脸失败既是联网核查失败
              this.setData({
                checkCode: -1,
              });
              this.data.ocrData.smDgrRtoRslt = "未识别";
              nt.showMessagebox(error.chnlMsgInfo, "对比失败", {
                type: 'error',
                confirmButtonText: '关 闭',
              });
            }
          }
        },
        fail: (error) => {
          console.error(error);
          this.setData({
            checkCode: -1,
          });
          nt.showMessagebox(error.message || "系統錯誤", "对比失败", {
            type: 'error',
            confirmButtonText: '关 闭',
          });
        },
      })
    },

    reviewStorageInfo() {
      console.log("review", this.data.storageFrom);
      let result = sessionStorage.getItem(`onlinecheck_data_${this.data.storageFrom}`);
      if (result) {
        result = JSON.parse(result);

        // 有缓存，提示
        if (!this.data.noConfirm) {
          nt.confirm(
            `检测到（${result.checkName}）已完成联网核查，是否复用联网核查信息？`,
            '确认信息',
          ).then(res => {
            this.setData({
              checkCode: result.checkCode,
              resultData: result.checkData,
              formModel: {
                checkNo: result.checkData.checkNo,
                checkName: result.checkData.checkName,
                checkType: "",
                checkReason: "",
              },
            });
          }).catch(() => { })
        } else {
          this.setData({
            checkCode: result.checkCode,
            resultData: result.checkData,
            formModel: {
              checkNo: result.checkData.checkNo,
              checkName: result.checkData.checkName,
              checkType: "",
              checkReason: "",
            },
          });
        }
      }
    },

    // Expose
    setFields(fields) {
      if (typeof fields === "object") {
        for (const field in fields) {
          if (Object.hasOwnProperty.call(this.data.formModel, field)) {
            this.data.formModel[field] = fields[field];
          }
        }
      }
    },
    onlineCheck() {
      this.onSubmitCheck();
    },
    updateModelValue(flag) {
      this.$emit("update:modelValue", flag);
    },
  },
  //数据监听
  observers: {
    checkName(value) {
      if (value) {
        this.data.formModel.checkName = value;
      }
    },
    checkIDNo(value) {
      if (value) {
        this.data.formModel.checkNo = value;
        // 如果联网核查已经有结果，而身份证又发生了变更，则清除旧数据
        if (this.data.resultData.checkNo) {
          this.resetResult();
        }
      }
    },
    modelValue(visible) {
      if (visible) {
        setTimeout(this.reviewStorageInfo, 300);
      }
    }
  },
});
