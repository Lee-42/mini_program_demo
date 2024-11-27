/* public\components\agent\agent.js */
import card from "../../utils/card";
import util from "../../utils/utils";
import common from "../../common/common";

Component({
  data: {
    //页面数据
    // formModel: {
    //   isAgent: 'N',
    //   cardNoType: null,
    //   cardNo: null,
    //   licenceAuthority: null,
    //   checkResult: null,
    //   linkNet: null,
    //   supportType: null,
    //   agentName: null,
    //   agentContact: null,
    // },
    onlinecheckVisible: false,
    onlinecheckId: null,
    idCardAvatar: null, // 身份证头像
    cacheOnlinecheckData: null,

    checkResultOptions: [],
    linkNetOptions: [],
    supportTypeOptions: [],
  },
  properties: {

    //props
    mainCd: { type: String, require: true },
    header: {
      type: String,
      default: "代理人信息",
    },
    border: {
      type: Boolean,
      default: true,
    },
    formModel: Object,
  },
  //生命周期
  created() {
    //created(函数只执行一次)
  },
  async ready() {
    //节点加载完成(函数只执行一次)
    const { mainCd } = this.data;
    // 核查结果
    await util.getSelectData({
      mainCd,
      flg: common.SelectDataType.C031,
      name: "checkResultOptions",
      that: this,
    });
    // 联网标志
    await util.getSelectData({
      mainCd,
      flg: common.SelectDataType.C032,
      name: "linkNetOptions",
      that: this,
    });
    // 佐证证件
    await util.getSelectData({
      mainCd,
      flg: "C033",
      name: "supportTypeOptions",
      that: this,
    });
  },
  async attached() {
    //active
  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {
    // 身份证号输入后校验
    async onCardNoValidate(_rule, value, callback) {
      const cache = this.data.cacheOnlinecheckData;
      if (cache) {
        // 上一次联网核查后，是否变更过身份证号
        if (cache.checkNo === value) {
          if (cache.checkCode === 0) {
            // 联网核查已通过
            return callback(true);
          }
        }
      }
      const { cardNoType } = this.data.formModel
      if (cardNoType === "1") {
        // 打开联网核查接口
        this.setData({
          onlinecheckVisible: true,
          onlinecheckId: value,
        });
      } else {
        callback(true);
      }
    },
    phoneNumberValidate(_rule, value, callback) {
       if (util.phoneValidate(value)) {
        callback(true);
      } else {
        callback(false, "非法手机号");
      }
    },
    clearFormValue(fields) {
      fields.forEach((field) => {
        this.data.formModel[field] = null;
      });
    },
    // formChange() {
    //   console.log('表单内容有变动就要通知父组件')
    //   this.$emit('agent-form-change', { ...this.data.formModel })
    // },
    onIsAgentChange(e) {
      console.log("onIsAgentChange", e);
      // 选择不是代理人，清空表单
      if (e === "N") {
        this.clearFormValue([
          "cardNoType",
          "cardNo",
          "licenceAuthority",
          "checkResult",
          "linkNet",
          "supportType",
          "agentName",
          "agentContact",
        ]);
      }
      // this.formChange()
    },

    // 获取身份证读取信息
    onGetCardInfo(info) {
      console.log("DEBUG: onGetCardInfo", info);
      if (info) {
        const { avatar } = info;
        this.setData({
          idCardAvatar: avatar,
        })
      }
    },

    // 联网核查 结果通知
    onOnlineCheck(result) {
      const { checkCode, checkData } = result;
      // 核查成功
      if (checkCode === 0) {
        // 缓存联网核查数据
        this.setData({
          cacheOnlinecheckData: { ...checkData, checkCode },
        });
        // 反显数据
        const { resultCode, checkDepartment, checkName } = checkData
        Object.assign(this.data.formModel, {
          checkResult: resultCode,
          licenceAuthority: checkDepartment,
          linkNet: "1",
          supportType: "0",
          agentName: checkName,
        })
      } else {
        // 核查失败，联网核查标志为0
        this.data.formModel.linkNet = '0';
      }
    },

    // Exposes
    // getFormData() {
    //   return { ...this.data.formModel }
    // },
    // changeField(field, value) {
    //   if (!field || value === void 0) {
    //     throw new Error(
    //       'changeField缺少必要参数(提供字段名或值不能为undefined)'
    //     )
    //   }
    //   if (Object.hasOwnProperty.call(this.data.formModel, field)) {
    //     this.data.formModel[field] = value
    //   }
    // },
  },
  //数据监听
  observers: {

  },
});
