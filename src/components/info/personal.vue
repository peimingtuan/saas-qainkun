<template>
  <div
    class="personal_info"
    :ref="dropId == 'personal_data' ? 'personal' : ''"
    :class="dropId == 'personal_data' ? 'personal_main_show' : ''"
  >
    <template v-if="!editPersonInfo">
      <div class="personal_top_box">
        <div class="header-img">
          <img
            v-if="user.head_portrait"
            :src="
              user.head_portrait.includes('/upload/meos/')
                ? `/api` + user.head_portrait
                : '/api/download/meos/' + user.head_portrait
            "
            alt=""
          />
          <Avatar v-else type="image" :size="48"></Avatar>
        </div>
      </div>
      <ul class="info_ul">
        <li>
          <span>姓名：</span> <span>{{ user.name }}</span>
        </li>
        <li>
          <span>邮箱：</span> <span class="main_span" :title="user.person_mail">{{ user.person_mail }}</span>
        </li>
        <li>
          <span>手机：</span> <span>{{ user.phone_num }}</span>
        </li>
        <li>
          <span>性别：</span>
          <span>{{ user.gender == "male" ? "男" : "女" }}</span>
        </li>
        <li>
          <span>生日：</span> <span>{{ user.birthday }}</span>
        </li>
      </ul>
      <div class="edit_btn">
        <Button
          type="default"
          v-if="user.person_id"
          @click.capture="editPersonInfo = true"
          >编辑资料</Button
        >
      </div>
    </template>
    <template v-if="editPersonInfo">
      <div class="personal_top_box">
        <div class="header-img">
          <img
            v-if="perInfo.headPortrait"
            :src="
              perInfo.headPortrait.includes('/upload/meos/')
                ? `/api` + perInfo.headPortrait
                : '/api/download/meos/' + perInfo.headPortrait
            "
            alt=""
          />
          <Avatar v-else type="image" :size="48"></Avatar>
          <div class="personal-edit">
            <span>编辑</span>
            <input
              class="inpFile"
              ref="inputfile"
              type="file"
              value="编辑"
              @change="inpFileChange"
            />
          </div>
        </div>
      </div>
      <ul class="info_ul">
        <li>
          <span>姓名：</span>
          <Input v-model="perInfo.name" width="172" placeholder="请输入姓名" />
        </li>
        <li>
          <span>邮箱：</span>
          <Input
            v-model="perInfo.personMail"
            width="172"
            placeholder="请输入邮箱名"
          />
        </li>
        <li>
          <span>手机：</span>
          <Input
            v-model="perInfo.phoneNum"
            width="172"
            placeholder="请输入手机"
          />
        </li>
        <li>
          <span>性别：</span>
          <MSelect width="172" v-model="perInfo.gender" :data="genderData" />
        </li>
        <li>
          <span>生日：</span>
          <PickerDate
            :scope="scopeDate"
            :date="perInfo.birthday"
            picker="day"
            width="172"
            @change="dateChangeSingle"
          />
        </li>
      </ul>
      <div class="edit_btn">
        <Button type="default" @click="handleCanle">取消</Button>
        <Button type="primary" @click="handleConfirm">保存</Button>
      </div>
    </template>
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
import moment from 'moment'
import { cloneDeep } from 'lodash'
import qs from 'qs'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('system')
export default {
  name: 'personal',
  components: { Avatar, Input, MSelect, PickerDate, Button, Message },
  props: {
    dropId: ''
  },
  data () {
    return {
      // 编辑用户信息状态
      editPersonInfo: false,
      // 临时的用户信息
      perInfo: {
        idNumber: '',
        personId: '',
        head_portrait: '',
        headPortrait: '',
        name: '',
        personMail: '',
        person_mail: '',
        phoneNum: '',
        phone_num: '',
        birthday: '',
        gender: ''
      },
      genderData: [
        { id: 'male', name: '男' },
        { id: 'female', name: '女' }
      ],
      scopeDate: `1950.01.01 00:00-${moment().format('YYYY.MM.DD HH:mm')}` // 生日不能选择未来日期
    }
  },
  mounted () {
    // 对用户信息进行深拷贝
    this.setSelUserFromUser()

    window.addEventListener(
      'click',
      (e) => {
        if (
          !this.editPersonInfo &&
          this.$refs.personal &&
          !this.$refs.personal.contains(e.target)
        ) {
          this.$parent.dropId = ''
          this.editPersonInfo = false
        }
      },
      true
    )
  },
  methods: {
    // 从用户信息中获取需要保存的信息
    setSelUserFromUser () {
      this.perInfo = {
        idNumber: this.user.id_number,
        personId: this.user.person_id,
        headPortrait: this.user.head_portrait,
        name: this.user.name,
        personMail: this.user.person_mail,
        phoneNum: this.user.phone_num,
        birthday: (this.user.birthday || '').replace(/\-/g, '.'),
        gender: this.user.gender
      }
    },
    dateChangeSingle (date) {
      this.perInfo.birthday = date
    },
    handleCanle () {
      this.editPersonInfo = false
      this.setSelUserFromUser()
    },
    //  保存个人资料
    handleConfirm () {
      // 修改资料
      if (!this.perInfo.name) {
        Message.warning('请输入姓名')
        return
      }
      if (this.perInfo.name.trim().length > 20) {
        Message.warning('姓名最多可输入20个字符')
        return
      }
      if (!this.perInfo.personMail) {
        Message.warning('请输入邮箱')
        return
      }
      if (this.perInfo.personMail.trim().length > 50) {
        Message.warning('邮箱最多可输入50个字符')
        return
      }
      if (!this.perInfo.phoneNum) {
        Message.warning('请输入手机')
        return
      }
      if (!/^[0-9-]{11,13}$/.test(this.perInfo.phoneNum)) {
        Message.warning('手机号须为11到13位数字，可包含-')
        return
      }
      if (!this.perInfo.gender) {
        Message.warning('请选择性别')
        return
      }
      if (!this.perInfo.birthday) {
        Message.warning('请选择生日')
        return
      }

      this.$axios
        .post(this.$api.updatePersonInfo, {
          ...this.perInfo,
          birthday: this.perInfo.birthday.replace(/\./g, '-')
        })
        .then((res) => {
          if (res.data.Result == 'success') {
            Message.success('修改成功！')

            const user = cloneDeep(this.user)

            user.id_number = this.perInfo.idNumber
            user.person_id = this.perInfo.personId
            user.head_portrait = this.perInfo.headPortrait
            user.name = this.perInfo.name
            user.person_mail = this.perInfo.personMail
            user.phone_num = this.perInfo.phoneNum
            user.birthday = this.perInfo.birthday
            user.gender = this.perInfo.gender

            this.$store.commit('system/merge', {
              user
            })
          } else {
            Message.error(res.data.ResultMsg)
          }
          this.editPersonInfo = false
        })
    },
    // 上传图片
    inpFileChange (e) {
      const formData = new FormData()
      formData.append('file', e.target.files[0])
      const config = {
        baseURL: null,
        headers: {
          'Content-Type': 'multipart/form-data;charset=UTF-8',
          mergeParams: false
        }
      }
      this.$axios.post('/api/upload/meos', formData, config).then((res) => {
        if (res.data.result == 'success') {
          this.perInfo.headPortrait = res.data.url
        } else {
          Message.error('头像上传失败！')
        }
      })
    }
  },
  computed: {
    ...mapState({
      // 当前用户信息
      user: (state) => {
        return state.user
      }
    })
  }
}
</script>

<style scoped lang="less">
.personal_info {
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
  .personal_top_box {
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    width: 100%;
    height: 90px;
    line-height: 90px;
    text-align: center;
    background-image: url("../../assets/img/bg_person.png");

    .header-img {
      /*vertical-align: middle;*/
      width: 48px;
      height: 48px;
      margin: auto;
      top: 20px;
      border-radius: 24px;
      position: relative;
      overflow: hidden;
      .personal-edit {
        position: absolute;
        bottom: -20px;
        left: 0px;
        /*bottom: -20px;*/
        background-color: rgba(31, 36, 41, 0.75);
        width: 48px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #fff;
        transition: bottom 0.3s;
        display: inline-block;
        span {
          font-size: 12px;
          color: #fff;
        }
        .inpFile {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 100%;
          height: 20px;
          font-size: 0;
          cursor: pointer;
        }
      }

      .p-avatar {
        /*vertical-align: middle;*/
        padding-right: 0;
      }
      img {
        /*vertical-align: middle;*/
        width: 48px;
        height: 48px;
        border-radius: 24px;
        overflow: hidden;
      }
    }
    .header-img:hover {
      .personal-edit {
        cursor: pointer;
        bottom: -2px;
      }
    }
  }
  .info_ul {
    padding: 12px;
    li {
      display: flex;
      align-items: center;
      line-height: 22px;
      font-size: 14px;
      margin-top: 8px;
      color: #8d9399;
      span:last-child {
        color: #1f2429;
      }
    }
    li:first-child {
      margin-top: 0;
    }
    .main_span{
      overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
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
