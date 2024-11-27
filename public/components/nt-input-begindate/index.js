import { manageDateGroups } from "../../utils/data";

Component({
  data: {
    begindate: "",
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    // 是否允许输入当天日期，默认允许
    isToday: {
      type: Boolean,
      default: false,
    },

    formModel: {
      type: Object,
      default: () => ({}),
    },

    group: {
      type: String,
    },
    format: {
      type: String,
    },
    fieldName: {
      type: String,
    },
    prop: {
      type: String,
    },
    ntValidator: {
      type: Function,
    },
    label: {
      type: String,
      default: "开始日期",
    },

    // 是否必填
    required: {
      type: Boolean,
      default: false,
    },
    ntValidator: {
      type: Function,
    },
  },
  methods: {
    // begindateRule(rule, value, callback) {
    //   let groupId = this.data.group;
    //   let group = manageDateGroups(groupId, "check");

    //   const { begindate, enddate } = group; // 解构出开始日期和结束日期
    //   const currentDate = new Date();
    //   const year = currentDate.getFullYear();
    //   const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    //   const day = currentDate.getDate().toString().padStart(2, "0");
    //   const today = `${year}${month}${day}`;
    //   const regExp =
    //     /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/;
    //   if (!regExp.test(value) && value) {
    //     return callback(false, "日期格式不正确");
    //   } else if (this.data.isToday && begindate == today && value) {
    //     return callback(false, "日期不能等于今天");
    //   } else if (this.data.ntValidator) {
    //     this.data.ntValidator(rule, value, callback);
    //   } else {
    //     return callback(true);
    //   }
    // },

    begindateRule(rule, value, callback) {
      let groupId = this.data.group;

      let group = manageDateGroups(groupId, "check");

      const { begindate, enddate } = group; // 解构出开始日期和结束日期

      // 将日期字符串转换为可比较的格式
      const date1 = new Date(
        begindate.slice(0, 4),
        begindate.slice(4, 6) - 1,
        begindate.slice(6, 8)
      );
      const date2 = new Date(
        enddate.slice(0, 4),
        enddate.slice(4, 6) - 1,
        enddate.slice(6, 8)
      );

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDate.getDate().toString().padStart(2, "0");
      const today = `${year}${month}${day}`;
      const regExp =
        /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/;
      if (!regExp.test(value) && value) {
 
        return callback(false, "日期格式不正确");
      } else if (date2 < date1 && value && enddate) {
         return callback(false, "开始日期不得晚于结束日期");
      } else if (begindate == enddate && this.data.isEqual && value && enddate) {
         return callback(false, "开始日期不能等于结束日期");
      } else if (this.data.isToday && enddate == today && value) {
         return callback(false, "日期不能等于今天");
      } else if (this.data.ntValidator) {
         this.data.ntValidator(rule, value, callback);
      } else {
         return callback(true);
      }
    },

    handleInput(e) {
      if (e) {
        let v = e;

        // 是否纯数字输入 小数点也不允许
        v = v.replace(/[^0-9]/g, "");
        // 限制输入为8位数字
        if (v.length > 8) {
          v = v.slice(0, 8);
        }
        // 通知到表单组件修改值
        // 修改子组件input框内的显示内容
        this.$nextTick(() => {
          this.setData({
            begindate: v,
          });
          this.$emit("update:modelValue", v);
          this.$refs.inputZ.value = v;
        });
        let groupId = this.data.group;
        let group = manageDateGroups(groupId, "create");
        group[groupId].begindate = v;
      }
    },
    handleBlur(e) {
 
      let v = e.target.value;

      let groupId = this.data.group;
      let group = manageDateGroups(groupId, "create");
      group[groupId].begindate = v;
    },
  },
  //数据监听
  observers: {
    modelValue: {
      handler(val) {
        this.setData({
          begindate: val,
        });
        let groupId = this.data.group;
        let group = manageDateGroups(groupId, "create");
        group[groupId].begindate = val;

        
        this.$nextTick(() => {
          const inputField = document.querySelector(
            `input[fieldname="${this.data.fieldName}"]`
          );

          if (inputField) {
             inputField.setAttribute("isvalidated", false);

            // 查找父元素是否是 某标签元素
            function findParentWithTagName(element, tagName) {
              // 如果当前元素是null或者已经到达body元素，则停止递归
              if (
                element === null ||
                element.tagName.toLowerCase() === "body"
              ) {
                return null;
              }
              // 检查当前元素是否包含指定的className
              if (element.tagName.toLowerCase() === tagName.toLowerCase()) {
                return element;
              } else {
                // 如果当前元素不是某标签元素，则向上查找其父元素
                return findParentWithTagName(element.parentElement, tagName);
              }
            }

            let temp = findParentWithTagName(inputField, "form");
            console.dir(temp);

            temp.customFieldInfo.clearValidate();
          }  
          
        });
      },
      immediate: true,
    },
  },
});
