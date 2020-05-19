const { RequestPromise } = require('../../utils/RequestHelper.js');

// 用户相关接口

// 从用户中心用户信息
const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getApp().globalData.UCUrl + '/foundation-user/user',
      data: { needPhone: true },
      method: 'GET',
      header: { 'Authorization': "Bearer " + getApp().globalData.globtoken },
      success: function (res) {
        if(res && res.data && res.data.code == 200) {
          resolve(res.data.body)
        } else if(res && res.data && res.data.message){
          reject(res.data.message)
        } else {
          reject()
        }
      },
      fail: function (err) {
        reject(err)
      },
      complete: function (res) {

      }
    })
  })
}

/**
 * 通过phone获取CommissionUcenterId(用于热门分享营销关系)
 * @param phone
 */
const getEncodeCommissionUcenterId = (phone) => {
  return RequestPromise({
    method: 'GET',
    url: '/commission/getEncodeCommissionUcenterId',
    params: {
      phone
    }
  })
}



module.exports = {
  getUserInfo,
  getEncodeCommissionUcenterId
}
