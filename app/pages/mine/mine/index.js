const common = require('../../../utils/common.js');
const util = require('../../../utils/util.js');
import AppService from '../../../AppService/index';
const { getVipInfo } = require('../../../api/vip/index.js');

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTab: true, // 是导航页
    userInfo: {},
    messgeInfo: {},
    orderCountData:{},
    stripData:{},
      isLogin: Boolean(getApp().globalData.haslogin),
    eCardCount:{},
    route: '',   // 页面路由
      haveVerifyInfo: false, // 是否已经实名
      id_card_info: null, // 已经实名认证的信息
    vipInfo: {      // 会员中心信息
      is_vip: false,   // 是否是会员
      remain_days: 0,  // vip剩余天数
      member_name: ''  // 会员中心昵称
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      route: this.route
    })
    wx.hideShareMenu();
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
      this.setData({
          isLogin: Boolean(getApp().globalData.haslogin)
      })
    // 获取会员信息
    getVipInfo().then((result) => {
      const {is_vip, remain_days, member_name, phone} = result
      this.setData({vipInfo: {is_vip, remain_days, member_name: member_name? member_name: phone} })
    }).catch((err) => {
      wx.showToast({ title: err || '获取会员信息失败', icon: 'none'})
    })
    common.getMoreCount((res)=>{
      this.setData({
        stripData:res.data,
      })
    })
    common.getUserInfo((res) => {
      this.setData({
        userInfo: res.data.body,
        globalUserInfo: app.globalData.userInfo
      })
    })
    common.getOrderCount((res) => {
      this.setData({
        orderCountData: res.data
      })
    })
    common.eCardCount((res) => {
      this.setData({
        eCardCount: res
      })
    })
      this._getUserIdCardInfo();
  },

    // 获取用户实名状态
    _getUserIdCardInfo: function() {
        let that = this;
        AppService.OtherTask.getUserIdCardInfo(
            null,
            (result) => {
                if (result.hasOwnProperty('data') && result.data && result.data.hasOwnProperty('has_certify_info')) {
                    let rst = result.data.has_certify_info;
                    if (rst) {
                        // 已经实名认证
                        that.setData({
                            haveVerifyInfo: true, // 有实名信息
                        });
                        // 已实名信息
                        that.data.id_card_info = result.data.id_card_info;
                    } else {
                        // 未实名认证
                        that.setData({
                            haveVerifyInfo: false,   // 没有实名信息
                        })
                    }
                }
            }, (error) => {

            }
        )
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  //获取用户信息
  getUserInfo:function(){

  },
  // 去订单列表
  checkOrderList:function(event){
    // type 全部 0 待付款 1 待发货 2 待收货 3 带评价 4 退货 5
    var type = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/wxpage/wxpage?type='+type
    })
  },

    // 点击营销管理
    onPromoteManagerItemClick: function () {
        // 未登录
        if (app.globalData.haslogin == false) {
            wx.navigateTo({
                url: '/pages/login/login?redirect_uri=switchTabMine'
            });
            return
        }
        wx.navigateTo({
            url: '/pages/mine/promote/index'
        });
    },

  // 列表被点击
  listItemCliclk:function(event){
    // index list0 我的拼团 list1 我的收藏 list2  卡券包 list3 e卡管理 list4 联系客服 listuser 用户头像
    const _list = event.currentTarget.dataset.list;
    wx.navigateTo({
      url: '/pages/wxpage/wxpage?type=' + _list
    })
  },
  // 查看消息列表
  checkInforList: function () {
    if (!util.checkBindStatus()) {
      return
    }
    wx.navigateTo({
      url: '/pages/informationList/informationList',
    })
  },

  clearCliclk: function () {
    let that = this;
    wx.request({
      url: 'http://wxapp.tairanmall.com/ucenter/gateway/foundation-user/user/unbind?type=WECHAT',
      method: 'PUT',
      header: {
        Authorization: 'Bearer ' + getApp().globalData.globtoken
      },
      success: function(res) {
        wx.showToast({
          title: '解绑成功',
          icon: 'none'
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '解绑失败',
          icon: 'none'
        })
      },
      complete: function(res) {

      }
    })
  },

    // 点击已实名按钮
    onVerifyOkBtnClick: function () {
        let params = this.data.id_card_info ? JSON.stringify(this.data.id_card_info) : null;
        let url = '/pages/mine/verifyOK/verifyOK';

        if (params) {
            params = encodeURIComponent(params);
            url = url + '?id_card_info=' + params;
        }
        wx.navigateTo({
            url: url,
        })
    },

    // 点击未实名按钮
    onVerifyNoBtnClick: function () {
        wx.navigateTo({
            url: '/pages/mine/verifyName/verifyName',
        })
    },
  /**
   * 跳转到会员页面
   */
  turnVipPage() {
    wx.navigateTo({
      url: '/pages/vipPage/vipPage'
    })
  }

})