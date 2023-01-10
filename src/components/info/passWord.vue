<template>
    <div class="personal_psd" :ref="dropId == 'change_password' ? 'personalPsd' : ''" :class="dropId == 'change_password' ? 'personal_main_show' : ''" tabindex="1" @blur="blur">
        <div class="personal_top">修改密码</div>
        <ul class="psd_ul">
            <li>
                <div class="row-title">原密码：</div>
                <div>
                    <Input v-model="password" @blur="inputBlur(0)" @clear="inputBlur(0)" :error-info.sync="errorMsg[0]" width="214" placeholder="请输入原密码" />
                </div>
            </li>
            <li>
                <div class="row-title">新密码：</div>
                <div>
                    <Input v-model="newPassword" @blur="inputBlur(1)" @clear="inputBlur(1)" :error-info.sync="errorMsg[1]" width="214" placeholder="请输入新密码" />
                </div>
            </li>
            <li>
                <div class="row-title">再次输入新密码：</div>
                <div>
                    <Input v-model="newRePassword" @blur="inputBlur(2)" @clear="inputBlur(2)" :error-info.sync="errorMsg[2]" width="214" placeholder="再次输入新密码" />
                </div>
            </li>
        </ul>
        <div class="edit_btn">
            <Button type="default" @click="handleCanle">取消</Button>
            <Button type="primary" @click="handleConfim">保存</Button>
        </div>
    </div>
</template>

<script>
import {
  Avatar,
  Input,
  Button,
  MSelect,
  PickerDate,
  Message
} from 'meri-design'
import { createNamespacedHelpers } from 'vuex'
import { loginOut } from '../../utils/system'
const { mapState } = createNamespacedHelpers('system')
export default {
  name: 'passWord',
  components: { Avatar, Input, MSelect, PickerDate, Button, Message },
  props: {
    dropId: ''
  },
  data () {
    return {
      password: '',
      newPassword: '',
      newRePassword: '',
      errorMsg: {}
    }
  },
  watch: {
    dropId (n) {
      if (!n) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  },
  mounted () {
    window.addEventListener(
      'click',
      (e) => {
        if (
          this.$refs.personalPsd &&
          !this.$refs.personalPsd.contains(e.target)
        ) {
          this.$parent.dropId = ''
        }
      },
      true
    )
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    inputBlur (key) {
      const type = [this.password, this.newPassword, this.newRePassword][key]
      if (key === 0) {
        if (!type) {
          this.$set(this.errorMsg, key, '原密码不能为空')
          return
        }
      }
      if (key === 1) {
        if (
          !/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9_\-!@#$^&*+]{8,15}$/.test(type)
        ) {
          this.$set(
            this.errorMsg,
            key,
            '密码为8-15位，数字、英文组合，可包含_-!@#$^&*+'
          )
          return
        }
      }
      if (key === 2) {
        if (this.newRePassword !== this.newPassword) {
          this.$set(this.errorMsg, key, '两次输入的密码不一致')
          return
        }
      }
      this.$set(this.errorMsg, key, '')
    },
    handleCanle () {
      this.$parent.dropId = ''
    },
    handleConfim () {
      // 修改密码
      if (!this.password) {
        Message.warning('请输入原密码')
        return
      }
      if (!this.newPassword) {
        Message.warning('请输入新密码')
        return
      }
      if (
        !/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9_\-!@#$^&*+]{8,15}$/.test(this.newPassword) ||
        this.newPassword.length < 8 ||
        this.newPassword.length > 15
      ) {
        Message.warning('密码为8-15位数字或英文,可包含_-!@#$^&*+')
        return
      }
      if (!this.newRePassword) {
        Message.warning('请再次输入新密码')
        return
      }
      if (this.newRePassword != this.newPassword) {
        Message.warning('再次输入的密码与新密码不一致')
        return
      }
      this.$axios
        .post(this.$api.updatePasswordService, {
          puser: {
            userId: this.user.userId, // 类型：String  必有字段  备注：账号id
            loginDevice: 'PC' // 类型：String  必有字段  备注：登录设备 取值：PC/iPhone/Android
          },
          password: this.password,
          newPassword: this.newPassword,
          newRePassword: this.newRePassword,
          userName: this.user.userName
        })
        .then((res) => {
          if (res.data.result == 'success') {
            res.data.content[0].resultType == 1
            switch (res.data.content[0].resultType) {
              case '0':
                Message.warning('原密码错误')
                break
              case '1':
                Message.success('修改成功')
                this.$parent.dropId = ''
                loginOut()
                break
              case '2':
                Message.warning('新密码与原密码重复')
                break
              case '3':
                Message.warning('第三方密码修改失败')
                break
              default:
                Message.warning('修改失败')
            }
          } else {
            this.$parent.dropId = ''
            Message.warning('修改失败')
          }
        })
    },

    blur () {
      // this.$parent.dropId = ''
    }
  }
}
</script>

<style scoped lang="less">
.personal_psd {
    position: fixed;
    top: 52px;
    right: -240px;
    display: inline-block;
    outline: none;
    background: #fff;
    border: 1px solid #e4e5e7;
    border-top: 0;
    border-radius: 4px;
    box-shadow: 0 2px 10px 0 rgb(31 35 41 / 10%);
    width: 240px;
    z-index: 100;
    transition: right 0.3s;
    .personal_top {
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: cover;
        width: 100%;
        height: 90px;
        line-height: 90px;
        padding-left: 12px;
        font-size: 16px;
        color: #fff;
        background-image: url("../../assets/img/bg_pwd.png");
    }
    .psd_ul {
        padding: 12px;
        li {
            margin-bottom: 35px;
            .row-title {
                line-height: 22px;
                font-size: 14px;
                margin-bottom: 4px;
            }
        }
        li:first-child {
            margin-bottom: 15px;
        }
        li:last-child {
            margin-bottom: 0;
        }
    }
    .edit_btn {
        padding: 20px;
        text-align: center;
    }
}
.personal_main_show {
    right: 8px;
}
</style>
