<template>
  <div class="fix-box" @click.stop @keyup.esc="confirmCancel">
    <div class="header">请授权</div>
    <div class="tip">
      <span class="icon">!</span>
      需要级别{{ level }}以上人员授权
    </div>
    <nt-form :model="model">
      <nt-form-item label="柜员号" prop="userid" required :ntValidator="onUserIdValidate">
        <nt-input v-model="model.userid" fieldName="userid" maxlength="6" placeholder="请输入授权柜员号"
          myAutoFocus="auth-dialog" />
      </nt-form-item>
      <nt-form-item label="密码" prop="entry_pwd" required :ntValidator="checkUser">
        <nt-input type="password" v-model="model.entry_pwd" fieldName="entry_pwd" maxlength="6" placeholder="请输入密码" />
      </nt-form-item>
      <div class="footer">
        <nt-button class="nt-button nt-button--primary" type="primary" fieldName="auth-confirm"
          @click="$emit('confirm')" :disabled="!pass">确定</nt-button>
        <nt-button class="nt-button" fieldName="auth-cancel" @click="$emit('cancel')">取消</nt-button>
      </div>
    </nt-form>
  </div>
</template>

<script>
  import nt from '@/api';
  import { defineAsyncComponent, } from 'vue';
  import { ComponentById, ComponentExport, randomString } from '@/router/component';
  import api from '../../common/api';
  const id = randomString()
  const Component = (...args) => {
    return ComponentById(id, ...args)
  }

  Component({
    properties: {
      level: [Number, String],
      auth_id: {
        type: String,
        required: true,
      },
      auth_seq: {
        type: String,
        required: true,
      },
    },

    data: {
      needPermissionArray: [{ auth_lvl: "5" }],

      model: {
        userid: "",
        entry_pwd: "",
      },

      pass: false,
    },

    ready() {
      setTimeout(() => {
        // 控制焦点
        const input = document.querySelector(".el-input__inner[myautofocus=auth-dialog]")
        if (input) {
          input.focus()
        }
      }, 500);
    },

    methods: {
      onUserIdValidate(_, value, callback) {
        if (typeof value === "string" && value.length === 6) {
          if (/\d{6}/.test(value)) {
            callback(true)
            return
          }
        }
        callback(false, "请输入6位数字柜员号")
      },

      checkUser(_, value, callback) {
        const { auth_id, auth_seq } = this.data
        const { userid } = this.data.model

        api.request({
          url: "updateAuthlogForTxAuth",
          data: {
            userid,
            entry_pwd: value,
            auth_id,
            auth_seq,
            auth_teller: userid,
            self_enable: "0",
          },
          success: (res) => {
            if (/成功/.test(res.data.data.msg)) {
              this.setData({ pass: true });
              callback(true);
            } else {
              callback(false, res.data.data.msg || "系统错误");
            }
          },
          fail: (err) => {
            callback(false, err.response.data.errMsg || "系统错误");
          }
        });
      },

      confirmCancel() {
        nt.alert("是否关闭授权弹窗？", "提示", {
          showCancelButton: true,
          beforeClose: (action, _, done) => {
            if (action == "confirm") {
              this.$emit('cancel');
            }
            done();
          }
        });
      },
    },
  })


  var ComponentPage = ComponentExport(id);

  ComponentPage.components = {
    'NtForm': defineAsyncComponent(() => import('@/components/desktop/form/form/form.vue')),
    'NtFormItem': defineAsyncComponent(() => import('@/components/desktop/form/form-item/form-item.vue')),
    'NtInput': defineAsyncComponent(() => import('@/components/desktop/form/input/input.vue')),
    'NtButton': defineAsyncComponent(() => import('@/components/desktop/form/button/button.vue')),
  }

  export default ComponentPage;
</script>

<style scoped lang="less">
  .fix-box {
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 10px;
    padding: 20px;
    box-shadow: var(--nt-box-shadow-light);
    border-radius: var(--nt-border-radius-base);
    border: 1px solid var(--nt-border-color-light);
    background-color: var(--nt-color-white);
    overflow: hidden;
    line-height: 1;
  }

  .header {
    font-size: 18px;
    font-weight: bold;
  }

  .tip {
    margin: 16px 0;
    font-size: 12px;
    color: #999;

    .icon {
      display: inline-block;
      width: 12px;
      height: 12px;
      background-color: orange;
      border-radius: 50%;
      text-align: center;
      color: #fff;
    }
  }

  .el-form-item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    :deep(.el-form-item__label) {
      margin-right: 8px;
      width: 46px;
      text-align: right;
    }

    :deep(.el-form-item__content) {
      position: relative;
    }

    :deep(.el-input__wrapper) {
      display: inline-flex;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
      padding: 1px 11px;
      background-color: var(--nt-fill-color-blank);
      background-image: none;
      border-radius: var(--nt-border-radius-base);
      cursor: text;
      transition: var(--nt-transition-box-shadow);
      transform: translate3d(0, 0, 0);
      box-shadow: 0 0 0 1px var(--nt-border-color) inset;

      &:hover {
        box-shadow: 0 0 0 1px #c0c4cc inset
      }

      &.is-focus {
        box-shadow: 0 0 0 1px var(--nt-color-primary) inset;
      }
    }

    :deep(.el-input__inner) {
      padding: 6px;
      line-height: 1.4;
      outline: 0;
      border: none;
      background: 0 0;
      width: 200px;

      &:focus {
        outline: 0;
      }

      &::-moz-placeholder {
        color: #a8abb2;
      }

      &:-ms-input-placeholder {
        color: #a8abb2;
      }

      &::placeholder {
        color: #a8abb2;
      }
    }

    &.is-error :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px var(--nt-color-danger) inset;
    }

    :deep(.el-form-item__error) {
      color: var(--nt-color-danger);
      font-size: 12px;
      line-height: 1;
      padding-top: 2px;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }

  .footer {
    text-align: right;
  }
</style>