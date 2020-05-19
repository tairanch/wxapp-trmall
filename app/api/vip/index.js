// 会员中心相关
const { RequestPromise, RequestHelper } = require('../../utils/RequestHelper.js');
const app = getApp()

/**
 * 获取会员信息
 * @returns {*}
 */
const getVipInfo = () => {
  return RequestPromise({
    method: 'GET',
    url: '/vip/info'
  })
}


/**
 * 注册申请会员
 * @param phone               手机
 * @param member_name         会员名称
 * @param member_sex          性别，0：未知，1：男 2：女
 * @param birthday            生日
 * @param inviter             邀请人手机号
 * @param locationLatitude    所在位置纬度
 * @param locationLongitude   所在位置经度
 * @param location            位置
 * @returns {Q.Promise<any> | Promise<T>}
 */
const applyVipUser = ({phone='', member_name='', member_sex='', birthday='', inviter, locationLatitude, locationLongitude, location}) => {
  return RequestPromise({
    method: 'POST',
    url: '/vip/applyVipUser',
    params: {
      phone, member_name, member_sex, birthday, 
      inviter,
      locationLatitude,
      locationLongitude
    }
  })
}

/**
 * 更新会员信息
 * @param key inviter 邀请人, birthday 生日
 * @param value
 * @returns {*}
 */
const updateVipUser = (key='', value='') => {
  return RequestPromise({
    method: 'POST',
    url: '/vip/updateVipUser',
    params: {
      [key]: value
    }
  })
}

/**
 * 是否是邀请人检查（白名单）
 * @param phone 手机号
 * @returns {Promise<any>}
 */
const vipCheck = (phone) => {
  return new Promise((resolve, reject) => {
    RequestHelper({
      method: 'GET',
      url: '/inviter/check',
      baseUrl: app.globalData.vipcenter,
      params: { phone },
      success: (result={}) => {
        if(result && result.code == 200) { // 邀请人存在
          resolve()
        } else {
          reject(result.message || '保存失败')
        }
      },
      fail: (err) => {
        reject('保存失败')
      }
    })
  })
}

module.exports = {
  getVipInfo,
  applyVipUser,
  updateVipUser,
  vipCheck
}