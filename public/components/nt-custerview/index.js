import common from "../../common"
import card from '../../utils/card'
const {cardVerifyRule} = card
Component({
  properties: {
 
    // 表格配置
    tabConfigs: {
      type: Array,
      default: function () {
        return [];
      },
    },
    mainTranCd: {
      type: String,
      default: '',
    }

    // 表格数据
    // tableData: {
    //     type: Array,
    //     default: function () {
    //         return []
    //     }
    // },
  },
  data: {
    // 按钮加载
    cardLoading: false,
    idLoading: false,
    idModel: {
      cstNm: '', // 客户名称
      cstNo: '', // 客户号
      identTp: '', // 证件类型 默认身份证
      identNo: '', // 证件号码
      // acctNo: '', // 账号

      sendmark: '0', // 发送标志
      mode: '11', // 检查方式 10-机读，11-手输
      bustp: '', // 业务种类 01-银行账户业务， 02-信贷及征信， 03-支付结算
      idne: '', // 身份证号
      name: '',
      BsnChnCd: '', // 业务条线
    },

    // mainTranCd: 'CNAP', // 主交易代码 默认 CNAP  开户 2105
    cardModel: {
      acctNo: '', // 账号
    },
    // 当前叫号
    currentNumber: "A101",
    // 业务类型
    businessType: "个人业务",

    // 资产情况表格数据
    tableData: [],
    // 客户身份信息
    custInfos: {
      jpg: new URL("../assets/avatar.jpg", import.meta.url).href,
      customerName: "",
      // sex: "1",
      userId: "",
      customerType: "",
      IDType: "身份证",
      // ID: "440825199609995432",
      ID: "",
      cstSt: '', // 客户状态 0-未激活，1-正常，2-注销
    },
    cstLevelList: {
      '0': '普通客户',
      '1': '金级客户',
      '2': '白金客户',
      '3': '钻石客户',
    },
    // 推荐列表
    recommendTabs: [
      {
        message: "本客户未开通短信提醒功能，建议开通",
        type: 1,
      },
      {
        message: "本客户账户余额达到金卡条件，建议升级",
        type: 2,
      },
    ],

    // 是否登录状态
    isLogin: false,

    // 表单检验规则
    rules: {
      customerType: [
        { required: true, message: "请输入客户类型", trigger: "blur" },
      ],
      IDType: [{ required: true, message: "请选择证件类型", trigger: "blur" }],
      ID: [{ required: true, message: "请输入证件号码", trigger: "blur" }],
      customerName: [
        { required: true, message: "请输入客户名称", trigger: "blur" },
      ],
      userId: [{ required: true, message: "请输入卡号账号", trigger: "blur" }],
    },
    isStop: true,
    idenTypeListStr: "1|身份证|\n2|户口簿|\n3|护照|\n5|回乡证|",
    idenTypeList: []
  },
  computed: {
    cardConfig() {
      return [
        {
          label: "卡号/账号",
          prop: "ICID",
          autoModel: "ICCard",
          autoProp: "A",
          type: "input",
          rightBtn: {
            label: "读取",
            method: () => {
              nt.message.info("读取卡片中...");
              this.$refs.cardForm.GetICCardInfo();
            },
          },
        },
      ];
    },

    // 快速查询表单配置项
    idConfig() {
      return [
        {
          label: "客户类型",
          prop: "customerType",
          type: "select",
          options: [
            { label: "个人客户", value: "1" },
            { label: "企业客户", value: "2" },
          ],
          placeholder: "01-个人客户",
        },
        {
          label: "证件类型",
          prop: "IDType",
          type: "select",
          // selectOption: "certificateType",
          options: [
            { label: "身份证", value: "1" },
          ],
        },
        {
          label: "证件号码",
          prop: "ID",
          type: "input",
          autoModel: "IDCard",
          autoProp: "idNum",
          rightBtn: {
            label: "读取",
            method: () => {
              nt.message.info("读取证件中...");
              this.$refs.idForm.GetIdCardInfo();
            },
          },
        },
        {
          label: "客户名称",
          prop: "customerName",
          type: "input",
          autoModel: "IDCard",
          autoProp: "chName",
        },
      ];
    },
  },
  ready() {
    window.strictMode = true;
    
    this.getIdentTypeList()
  },
  methods: {
    identNumValidator(rule, value, callback) {
      if(this.data.idModel.identTp && this.data.idModel.identNo) {
        const result = cardVerifyRule(this.data.idModel.identTp, this.data.idModel.identNo)
        if (
          result.retCd
          ) {
            callback(true)
            return true // 用于同时支持form-item.ntValidator和this.validate自定义校验
          } else {
            callback(false, result.retMsg||'非法证件号')
            return false // 用于同时支持form-item.ntValidator和this.validate自定义校验
          }
      }
      callback(true)
      
      
    },
    getIdentTypeList() {
      // this.data.idenTypeListStr
      // 获取证件类型数据
      // let arr = this.data.idenTypeListStr.split("\n")
      // let idenTypeList = []
      // arr.map(v=> {
      //   let [value, label] = v.split("|")
      //   idenTypeList.push({
      //     label,
      //     value,
      //   })
      // })
      // this.setData({
      //   idenTypeList
      // })
      common.request({
        url: 'k042',
        data: {
          listCd: 'c002',
          mainTranCd: this.data.mainTranCd
        },
        success: (res)=> {
          const datas = res.data.data;
          const fileDataMap = datas.fileDataMap;
          let list = [];

          for(let key in fileDataMap) {
            list.push({
              label: fileDataMap[key],
              value: key
            })
          }
          this.setData({
            fileDataMap,
            idenTypeList: list,
            idModel: Object.assign(this.data.idModel, {
              identTp: list[0].value
            })
          })
        },
        fail: ()=> {

        }
      })
    },
    custHandle(type) {
      switch (type) {
        // 身份核验
        case 0: {
          break;
        }
        // 营销套餐
        case 1: {
          break;
        }
        // 财富信息
        case 2: {
          break;
        }
        default: {
          break;
        }
      }
    },

    queueHandle(type) {
      switch (type) {
        // 叫号
        case 0: {
          nt.message.success("客户已到达柜台！");
          this.submit();
          break;
        }
        // 重叫
        case 1: {
          this.setData({
            isLogin: false,
          });
          this.$parent.haveClient = false;
          nt.message.info("当前服务已结束！");
          break;
        }
        // 暂停
        case 2: {
          let index = !this.data.isStop;
          this.setData({
            isStop: index,
          });
          index ? nt.message.info("继续叫号") : nt.message.info("暂停叫号");
          break;
        }
        // 购物车
        case 3: {
          break;
        }
        default: {
          break;
        }
      }
    },

    // 去开通
    toActivate() {
    },

    // 去升级
    toUpgradation() {
    },
    getAvatar(info) {
      let {sendmark, mode, bustp} = this.data.idModel;
      common.request({
        url: 'c001',
        data: {
          sendmark, // 发送人行或公安标志
          mode, // 检查方式
          bustp, // 业务种类
          idno: info.cstNm, // 身份证号
          name: info.cstNo, // 客户名称
        },
        success: (res)=> {
          const datas = res.data.data;
          this.setData({
            // isLogin: true,
            custInfos: Object.assign(this.data.custInfos, {
              jpg: `data:image/jpg;base64,${datas.fileData}`,
              // customerName: this.data.idModel.name,
              // ID: this.data.idModel.idne, // 证件号
              // userId: this.data.idModel.cstNo, // 客户号
            })
          })
          
        },
        fail: (error)=> {

        }
      })
    },
    query(data) {
      common.request({
        url: 'k018',
        data,
        success: (res)=> {
          const datas = res.data.data;
          this.setData({
            isLogin: true,
            custInfos: Object.assign(this.data.custInfos, {
              customerName: datas.cstNm, // 客户名称
              ID: datas.identNo, // 证件号
              userId: datas.cstNo, // 客户号
              IDType: this.data.fileDataMap[datas.identTp],
              customerType: this.data.cstLevelList[datas.cstLvl]
            })
          })
          this.getAvatar(datas)
          
        },
        fail: (error)=> {

        }
      })
    },
    // 快捷查询
    quickQuery() {
      const data =  {
        mainTranCd: this.data.mainTranCd, // 主交易代码
        cstNo: this.data.idModel.cstNo, // 客户号
        cstNm: this.data.idModel.cstNm, // 客户名称
        identTp: this.data.idModel.identTp, // 证件类型
        identNo: this.data.idModel.identNo, // 证件号
      };
      this.query(data)
    },

    submit_card() {
      const data =  {
        mainTranCd: this.data.mainTranCd, // 主交易代码
        acctNo: this.data.cardModel.acctNo, //卡号
      };
      this.query(data)
     
    },

    reset_id() {
      this.resetForm("idForm");
    },

    reset_card() {
      this.resetForm("cardForm");
    },

    // 提交表单
    submit() {
      // this.setData({
      //   isLogin: true,
      //   idLoading: false
      // })
    },

    // 重置表单
    resetForm(refName) {
      this.$refs[refName].$refs.form.resetFields();
    },

    backQuery() {
      this.setData({
        isLogin: false,
      });
      this.$parent.haveClient = false;
    },
  },
});
