const { RequestPromise, RequestHelper } = require('../../utils/RequestHelper.js');
const { getVipInfo, applyVipUser, updateVipUser, vipCheck } = require('../../api/vip/index.js');
const { getUserInfo } = require('../../api/user/index.js');
const { redirectToLogin } = require('../../utils/routerHop.js');
const { navigateToMiniStore } = require('../../utils/util.js');
const { clearInviterInfo, setInviterInfo, judgeCacheTime } = require('../../utils/vip.js')
const { didSilentLoad } = require('../../utils/login')
const app = getApp()
const pageApi = {
  recommend: { url: `/vip/recommend`, method: "GET" }, // 会员推荐：http://dsapi.fengdai.org/#/home/project/inside/api/detail?groupID=51&childGroupID=247&apiID=2034&projectName=电商接口&projectID=20
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    recommendList:[],     // vip商品列表
    isagreement: false,   // 是否同意开通会员
    tabList: [            // 特权列表
      {icon: '/image/vipPage/tab1.png', name:'超值畅饮', index: '1'},
      {icon: '/image/vipPage/tab2.png', name:'全场9折', index: '2'},
      {icon: '/image/vipPage/tab3.png', name:'书吧VIP', index: '3'},
      {icon: '/image/vipPage/tab4.png', name:'精品沙龙', index: '4'},
      {icon: '/image/vipPage/tab5.png', name:'生日特权', index: '5'}
    ],
    contentList: [
      {index: '1', title:'价值360元超值畅饮', texts: [
          '内含10张小泰咖啡任意饮品券',
          '每张券可兑换小泰咖啡任意饮品一杯',
          '有效期自开卡日起一年',
        ]},
      {index: '2', title:'线上线下全场9折', texts: [
          '优惠可叠加，折上9折',
          '买越多，赚越多，轻松省回288',
          '线下特殊商品除外，线上仅限自营商品'
        ]},
      {index: '3', title:'会员专享空间', texts: [
          '数千本书籍免费阅读',
          '专享安静舒适空间',
          '会员可将图书外带'
        ]},
      {index: '4', title:'会员专属门店精品沙龙活动', texts: [
          '每月至少8场精品沙龙任意选择'
        ]},
      {index: '5', title:'会员生日送惊喜', texts: [
          '价值99元泰然城生日大礼包一份',
          '生日蛋糕一份'
        ]},
    ],
    userAvatar: '',            // 用户头像
    userName: '',              // 用户名字
    tabIndex: 1,               // 点击对特权序号
    is_vip: false,             // 是否是vip
    remain_days: 0,            // vip剩余天数
    member_level_end_time: '', // 会员到期时间
    vip_discount: 0,           // 会员折扣
    vipApiInviter: '',         // 接口返回的邀请人
    inviter: '',               // 邀请码: 扫码邀请人 or 用户自己输入的邀请人
    isOpening: false,          // 是否正在开通会员中
    showInviterPopup: false    // 是否展示邀请人弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this._inputInviter = '';                    // 用于输入邀请码时候校验
    const { scene = '' } = options;             // 获取url参数
    if(scene) {                                 // 通过扫码进入，如果有邀请人, 设置扫码邀请人
      setInviterInfo(scene)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserVipInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 判断邀请人有效性和缓存
   */
  checkVipInviter: function() {
    if(app.globalData.vipInviter) {                             // 如果存在邀请人
      // 如果有邀请人，则验证邀请人有效性
      vipCheck(app.globalData.vipInviter).then(() => {
        // 邀请人有效
        // 判断缓存
        if(judgeCacheTime(app.globalData.vipPageStartTime)) {
          // 缓存到期
          clearInviterInfo()
        } else {
          this.setData({
            inviter: app.globalData.vipInviter
          })
        }
      }).catch((err) => {
        // 无效, 则清空邀请人信息
        clearInviterInfo()
        this.setData({
          inviter: ''
        })
      })
    }
  },

  /**
   * 获取用户相关信息
   */
  getUserVipInfo () {
    if(app.globalData.globtoken) {              // 判断是否登入
      getVipInfo().then((result) => {
        const {is_vip, vip_discount, remain_days, phone, inviter, member_name, member_level_end_time} = result;
        this.setData({
          is_vip,
          vip_discount,
          remain_days,
          vipApiInviter: inviter,
          member_level_end_time: member_level_end_time ? member_level_end_time.slice(0, 10).replace(/-/g, '.'):''
        });
        app.globalData.userInfo.phone = phone;
        return member_name
      }).then((member_name)=>{
        // 获取用户信息
        getUserInfo().then((result) => {
          const {nickname, phone, avatar} = result;
          app.globalData.userInfo.phone = phone;
          const userAvatar = avatar ? avatar: (app.globalData.userInfo.isNew && app.globalData.userInfo.avatarUrl) ? app.globalData.userInfo.avatarUrl: '/image/head_icon.png';
          const userName = member_name ? member_name: nickname ? nickname: phone ? phone: app.globalData.userInfo.nickname ? app.globalData.userInfo.nickname: '';
          this.setData({
            userAvatar,
            userName
          })
        })

        // 校验并设置邀请码
        this.checkVipInviter()

      }).catch((err) => {
        wx.showToast({ title: err || '获取会员信息失败', icon: 'none'})
      })
      this.getRecommend().then(res => {
        this.setData({
          recommendList: [].concat(res, [{more: true, id: 'more'}])
        })
      })
    } else {
      didSilentLoad({
        redirect_uri: '/pages/vipPage/vipPage',
        isTab: false,
        isMini: true,
        success: () => {
          wx.redirectTo({
            url: '/pages/vipPage/vipPage'
          })
        }
      }, RequestHelper)
    }
  },

  /**
   * 获取折扣文案
   * @param vip_discount
   * @returns {string}
   */
  getDiscount (vip_discount) {
    const discounts = '' + vip_discount;
    let discountText = discounts[0];
    if(discounts[1] != 0) {
      discountText = discountText + '.' + discounts[1]
    }
    return discountText
  },

  /**
   * 跳转到门店-预约项目列表
   */
  turnActivity() {
    navigateToMiniStore('pages/reservation/reservationCatalog/reservationCatalog', {
      storeId: -1,
      url:"/pages/reservation/reservationCatalog/reservationCatalog"
    })
  },

  /**
   * 跳转到门店-我的卡券
   */
  turnCard() {
    navigateToMiniStore('pages/ucenter/myCoupon/myCoupon', {
      storeId: -1,
      url:"/pages/ucenter/myCoupon/myCoupon"
    })
  },
  /**
   * 点击特权
   */
  tapTab(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({
      tabIndex: +index
    })
  },
  /**
   * 开通会员
   */
  openVip() {
    if(this.data.isagreement) {
      this.authorizeLocation().then(() => {
        return this.getLocation()
      }).then((res) => {
        this.openVipRequest(res)
      }).catch((err) => {
        this.openVipRequest({})
      })
    } else {
      wx.showToast({ title: '请先阅读并同意《泰享会员(付费)服务协议》', icon: 'none'})
    }
  },

  /**
   * 请求开通会员接口
   * @param tude：{latitude, longitude}  纬度， 经度
   */
  openVipRequest(tude) {
    if(this.data.isOpening) {
      return;
    }
    wx.showLoading({
      title: '加载中'
    })
    const locationLatitude = tude && tude.latitude? tude.latitude: '';
    const locationLongitude = tude && tude.longitude? tude.longitude: '';
    this.setData({
      isOpening: true
    }, () => {
      applyVipUser({
        phone: app.globalData.userInfo.phone,
        inviter: this.data.inviter,
        locationLatitude: locationLatitude,
        locationLongitude: locationLongitude
      }).then((res) => {
        this.setData({
          isOpening: false
        })
        wx.redirectTo({
          url: `/pages/wxpage/wxpage?type=vipCashier&order_no=${res.order_no}&inviter=${this.data.inviter || ''}`
        })
      }).catch((err) => {
        this.setData({
          isOpening: false
        })
        wx.showToast({ title: err || '申请会员失败', icon: 'none'})
      })
    })
  },

  /**
   * 获取用户位置
   */
  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success (res) {
          const latitude = res.latitude;    // 纬度
          const longitude = res.longitude;  // 经度
          resolve({latitude, longitude})
        },
        fail(res) {
          reject()
        }
      })
    })

  },

  /**
   * 用户位置授权
   */
  authorizeLocation() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success () {
                resolve()
              },
              fail() {
                reject()
              }
            })
          } else {
            resolve()
          }
        },
        fail:res=>{
          resolve()
        }
      })
    })
  },

  /**
   * 获取推荐商品
   */
  getRecommend() {
    const {url,method} = pageApi.recommend
    return RequestPromise({
      method,
      url
    })
  },

  goodstail(event) {  //  跳转详情
    const _itemid = event.currentTarget.dataset.itemid;
    if(_itemid === 'more') {
      return;
    }
    wx.navigateTo({
      url: '/pages/wxpage/wxpage?type=itemdetails&itemid=' + _itemid
    })
  },

  /**
   * 查看更多
   * 跳转到小程序的搜索列表页，搜索项为“自营”+品牌=小泰良品
   */
  searchMore() {
    wx.navigateTo({
      url: '/pages/wxpage/wxpage?type=searchResultFromVip&service=is_self&brand=1744'
    })
  },

  /**
   * 跳转到会员协议
   */
  turnAgreement() {
    wx.navigateTo({
      url: '/pages/agreements/vipAgreement/vipAgreement'
    })
  },
  /**
   * 不同意协议
   */
  notAgree() {
    this.setData({
      isagreement: false
    })
  },
  /**
   * 同意协议
   */
  agree() {
    this.setData({
      isagreement: true
    })
  },
  setAgreement() {
    this.setData({
      isagreement: !this.data.isagreement
    })
  },

  /**
   * 关闭邀请人信息弹窗
   */
  closeInviterPopup() {
    this._inputInviter = '';
    this.setData({
      showInviterPopup: false
    })
  },
  /**
   * 打开邀请人信息弹窗
   */
  openInviterPopup() {
    this._inputInviter = '';
    this.setData({
      showInviterPopup: true
    })
  },

  /**
   * 输入邀请人
   */
  inputCode(e) {
    const value = e.detail.value;
    if(value.length > 11) {
      return this._inputInviter
    } else {
      this._inputInviter = value;
    }
  },

  /**
   * 邀请码输入白名单校验
   */
  invalidInviter() {
    return new Promise((resolve, reject) => {
      if(this._inputInviter) {
        vipCheck(this._inputInviter).then(() => {
          resolve(true)
        }).catch((err) => {
          reject(err)
        })
      } else {
        reject('请填写邀请码')
      }
    })
  },
  /**
   * 提交邀请码
   */
  sureCode() {
    this.invalidInviter().then(() => {
      if(this.data.is_vip) {   // 已开通vip, 需要请求接口
        setTimeout(() => {
          updateVipUser('inviter', this._inputInviter).then(() =>{
            this.setData({
              inviter: this._inputInviter,
              vipApiInviter: this._inputInviter
            }, () => {
              setInviterInfo(this._inputInviter, true)  // 设置填写邀请人
              this._inputInviter = '';
              wx.showToast({ title: '邀请码填写成功', icon: 'none'});
              this.closeInviterPopup()
            })
          }).catch((err) => {
            wx.showToast({ title: err || '提交失败', icon: 'none'});
          })
        })
      } else {                                    // 未开通， 记录在本地
        this.setData({
          inviter: this._inputInviter
        }, () => {
          setInviterInfo(this._inputInviter, true)      // 设置填写邀请人
          this._inputInviter = '';
          wx.showToast({ title: '邀请码填写成功', icon: 'none'});
          this.closeInviterPopup()
        })
      }
    }).catch((err) => {
      wx.showToast({ title: err, icon: 'none'});
    })
  }
})
