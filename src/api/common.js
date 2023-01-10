const common = {
  // 公共--api
  upload: process.env.VUE_APP_UPLOAD, // 上传接口
  download: process.env.VUE_APP_HOST + process.env.VUE_APP_DOWNLOAD // 下载接口 ($api.download/key?filename="xx"  (filename对下载的文件重命名))
}

const api = {
  ssoLogin: '/EMS_SaaS_Web/Spring/MVC/entrance/unifier/getPersonByUserNameService', // 登录
  login: '/EMS_SaaS_Web/Spring/MVC/entrance/unifier/loginUserServiceForEncrypt', // 对密码进行加密
  updatePersonInfo: '/saas-org-person/personManage/employee/updatePersonInfo', // 修改用户信息
  updatePasswordService: '/EMS_SaaS_Web/Spring/MVC/entrance/unifier/updatePasswordService', // 修改密码
  saveLog: '/system-log/log/saveLog' // 保存登录日志

}

for (const [key, value] of Object.entries(api)) {
  api[key] = `${process.env.VUE_APP_PROJECT}${value}`
}

export default { ...common, ...api }
