/**
 * 删除邀请码相关信息
 */
const clearInviterInfo = function() {
  getApp().globalData.vipInviter = '';
  getApp().globalData.vipPageStartTime = '';
  getApp().globalData.isInviterFromInput = false;
}

/**
 * 设置扫码的邀请人信息
 * @param inviter
 * @isInviterFromInput 是否来自用户填写
 */
const setInviterInfo = function (inviter, isInviterFromInput=false) {
  getApp().globalData.vipInviter = inviter;
  getApp().globalData.vipPageStartTime = new Date().getTime();
  getApp().globalData.isInviterFromInput = isInviterFromInput
}

/**
 * 判断缓存是否到期, 缓存24h
 * @param startTime vipPageStartTime or inputInviterStartTime
 * @returns {boolean} true: 到期 需要删除
 */
const judgeCacheTime = function (startTime) {
  const currentTime = new Date().getTime();
  const cacheTime = 24 * 60 * 60 * 1000;
  if((currentTime - startTime) > cacheTime) {
    return true
  } else {
    return false
  }
}


module.exports = {
  clearInviterInfo,
  judgeCacheTime,
  setInviterInfo
}