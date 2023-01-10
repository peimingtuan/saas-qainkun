
import axios from 'axios'
import api from '../api/common'
import moment from 'moment'
import { get } from 'lodash'

/**
 * 保存登录日志
 * @param {*} user 用户信息
 * @param {*} item
 */
export async function saveLoginLog (user, item) {
  console.log(user)

  let res

  try {
    res = await axios.post(api.saveLog, {
      // id: "12234123",                            //主键id，登出的时候必填，传的是登入时返回的id
      groupCode: user.groupCode, // 集团编码,必填
      projectId: get(user, 'projects[0].projectId', ''), // 项目编码,必填
      userName: user.userName, // 账号名称,必填
      // functionId: "",                       //功能点id,登陆类型为2时必填
      // superFunctionId: "",                     //上级功能点id,登陆类型为2时必填
      loginTime: moment().format('YYYYMMDDHHmmss'), // 登陆时间,字符串,格式:"20200517120000",保存登陆不为空
      logoutTime: '', // 登出时间,字符串,格式:"20200517120000",保存登出不为空
      pageType: '1', // 登陆页面类型,1:集团页面,2:项目页面,必填
      inOutType: '1', // 登陆类型,1:登入日志,  2:登出日志,必填
      logType: '1' // 登陆类型,1:系统登入登出日志,  2:功能点登入登出日志，必填
    })
    user.logId = res.data.content[0].id
  } catch (error) {
    res = {}
  }
}

/**
 * 跳转功能F
 * 页面进行跳转
 */
export async function saveFuntionLogin (user, item, projectId) {
  if (!user.logId) return
  axios.post(api.saveLog, {
    // id: user.logId,                            //主键id，登出的时候必填，传的是登入时返回的id
    groupCode: user.groupCode, // 集团编码,必填
    projectId: projectId || get(user, 'projects[0].projectId', ''), // 项目编码,必填
    userName: user.userName, // 账号名称,必填
    functionId: item.authorizationId, // 功能点id,登陆类型为2时必填
    superFunctionId: item.authorizationParentId, // 上级功能点id,登陆类型为2时必填
    loginTime: moment().format('YYYYMMDDHHmmss'), // 登陆时间,字符串,格式:"20200517120000",保存登陆不为空
    logoutTime: '', // 登出时间,字符串,格式:"20200517120000",保存登出不为空
    pageType: item.type === 2 ? '2' : '1', // 登陆页面类型,1:集团页面,2:项目页面,必填
    inOutType: '1', // 登陆类型,1:登入日志,  2:登出日志,必填
    logType: '2' // 登陆类型,1:系统登入登出日志,  2:功能点登入登出日志，必填
  })
}

// export async function saveFuntionLoginOut(user, item, project) {
//     if (!user.logId) return;
//     axios.post(api.saveLog, {
//         // id: user.logId,                            //主键id，登出的时候必填，传的是登入时返回的id
//         groupCode: user.groupCode,                           //集团编码,必填
//         projectId: get(user, "projects[0].projectId", ""),                               //项目编码,必填
//         userName: user.userName,                      //账号名称,必填
//         functionId: item.authorizationId,                       //功能点id,登陆类型为2时必填
//         superFunctionId: item.authorizationParentId,                     //上级功能点id,登陆类型为2时必填
//         // loginTime: "20200517120000",               //登陆时间,字符串,格式:"20200517120000",保存登陆不为空
//         logoutTime: moment().format("YYYYMMDDHHmmss"),              //登出时间,字符串,格式:"20200517120000",保存登出不为空
//         pageType: "1",                           //登陆页面类型,1:集团页面,2:项目页面,必填
//         inOutType: "2",                          //登陆类型,1:登入日志,  2:登出日志,必填
//         logType: "2"                         //登陆类型,1:系统登入登出日志,  2:功能点登入登出日志，必填
//     })
// }

/**
 * 退出登录
 * @param {*} user 用户信息
 */
export async function saveLoginOut (user, item) {
  if (!user.logId) return
  axios.post(api.saveLog, {
    id: user.logId, // 主键id，登出的时候必填，传的是登入时返回的id
    groupCode: user.groupCode, // 集团编码,必填
    projectId: get(user, 'projects[0].projectId', ''), // 项目编码,必填
    userName: user.userName, // 账号名称,必填
    functionId: item.authorizationId, // 功能点id,登陆类型为2时必填
    superFunctionId: item.authorizationParentId, // 上级功能点id,登陆类型为2时必填
    // loginTime: "20200517120000",               //登陆时间,字符串,格式:"20200517120000",保存登陆不为空
    logoutTime: moment().format('YYYYMMDDHHmmss'), // 登出时间,字符串,格式:"20200517120000",保存登出不为空
    pageType: '1', // 登陆页面类型,1:集团页面,2:项目页面,必填
    inOutType: '2', // 登陆类型,1:登入日志,  2:登出日志,必填
    logType: '2' // 登陆类型,1:系统登入登出日志,  2:功能点登入登出日志，必填
  })
}
