//index.js
//获取应用实例
const util = require('../../utils/util.js');
const RequestManager = require('../../utils/RequestHelper.js');
const common = require('../../utils/common.js');
const app = getApp()

Page({
  data: {
    isTab: true, // 是导航页
    listNoData: false,  //列表数据为空
    loadmore:false,
    toViewItem:'toViewItem0',       //导航滚动显示值
    scrollDirection:0,      //滚动方向
    select_index: 0,
    winHeight: '',          //窗口高度
    page: 1,
    total_page:10,          //总页码
    category_id: 11111111,  //默认精选的 id
    goodsList: [],
    categoryList: [],
    storeRequireKey: [],    //存储请求key 阻止重复请求
    arrivebottom:false,            //是否到底
    updata:false,
    imgShowArr: [],
    itemHeight:260,
    arrHeight:[],
    route: ''   // 页面路由
  },
  onLoad: function() {
    this.getCategory()
    this.getListData()
    this.setData({
      route: this.route
    })
    // this.getSysteminfs()
  },
  onShow: function() {
  },
  onReady:function(){
    //图片加载，延时1秒执行获取单个图片高度
    let that = this;
    
    setTimeout(function(){
      // that.getRect();
    },1000)
  },
  getRect:function(){
    let that = this;
    //获取图片节点的高度
    // wx.createSelectorQuery().select('.photo').boundingClientRect(function(rect){
    //   console.log(rect)
    //   that.setData({itemHeight:rect.height});
    //   that.imgInit(rect.height);
      
    // }).exec()
    that.imgInit(that.data.itemHeight);
    that.arrHeightInit();//初始化每张图片的位置
  },
  arrHeightInit:function(){
    for (let i = 0; i < this.data.imgShowArr.length; i++) {
      this.data.arrHeight[i] = Math.floor(i / 2) * this.data.itemHeight + 55
    }
  },
  imgInit:function(itemHeight){
    //获取页面打开未滚动时整屏显示的行数，每行2个图片*2 ，先加载 
    let index = parseFloat(app.globalData.winHeight / itemHeight);
    for (let i = 0; i < index * 2 && i < this.data.imgShowArr.length; i++){
      this.data.imgShowArr[i] = true;
    }
    this.setData({imgShowArr:this.data.imgShowArr})
  },
  typeSelect: function(event) {
    let _item = event.currentTarget.dataset.item
    let _index = event.currentTarget.dataset.index
    let _toViewItem = 'toViewItem' + _index
    let that = this
    that.setData({
      page: 1,
      arrivebottom:false,
      select_index: _index,
      category_id: _item.category_id,
      toViewItem: _toViewItem,
      goodsList:[]
    })
    that.getListData(); //会触发 swiper 这个请求阻止掉
  },
  getCategory: function() {
    let _self = this
    RequestManager.RequestGet(app.globalData.ctxPath+'/promotion/category', {}, function(res) {
      _self.setData({
        categoryList: res.data
      })
    }, null, true)
  },
  getListData: function(showloading) {
    var _this = this;
    var length = _this.data.goodsList.length
    if (_this.data.page >= _this.data.total_page + 1){
      return 
    }
    var params = {
      category_id: _this.data.category_id,
      page: _this.data.page,
      page_size: 20
    }

    let _storeRequireKey = _this.data.storeRequireKey
    let _requrekey = _this.data.category_id + _this.data.page
    let _indexof = _this.data.storeRequireKey.indexOf(_requrekey)
    if (_indexof != -1) {
      return
    } else {
      _storeRequireKey.push(_requrekey)
      _this.setData({
        storeRequireKey: _storeRequireKey
      })
    }
    _this.setData({
      updata: false
    })
    if (showloading == 'showloading'){
      _this.setData({
        loadmore: true
      })
    }else{
      _this.setData({
        loadmore: false
      })
    }
    RequestManager.RequestGet(app.globalData.ctxPath+'/promotion/getGroupBuyItem', params, function(res) {
      let _storeRequireKey = _this.data.storeRequireKey
      let _arrivebottom = res.data.page.current_page < res.data.page.total_page ? false:true
      _storeRequireKey.splice(_indexof,1)
      let _loadmore = res.data.page.current_page < res.data.page.total_page ? true : false

      var _goodsList = [], _imgShowArr = [];
      if (_this.data.page == 1) {
        _goodsList = res.data.items;
        for (let i = 0; i < res.data.items.length; i++) {
          _imgShowArr.push(false);
        }
      }else{
        _goodsList = _this.data.goodsList.concat(res.data.items);
        for (let i = 0; i < res.data.items.length; i++) {
          _this.data.imgShowArr.push(false);
          _imgShowArr = _this.data.imgShowArr;
        }
      }
      if (_goodsList.length <= 0){
        _this.setData({listNoData:true})
      }else{
        _this.setData({listNoData: false })
      }
      _this.setData({
        imgShowArr: _imgShowArr,
        storeRequireKey: _storeRequireKey,
        arrivebottom: _arrivebottom,
        total_page: res.data.page.total_page || 10,
        goodsList: _goodsList,
        page: res.data.page.current_page < res.data.page.total_page ? _this.data.page + 1 : _this.data.page
      });

      _this.getRect();//初始化图片第一屏加载
      
      setTimeout(function (){
        _this.setData({
          updata: true,
          loadmore: _loadmore
        })
      },0)
    }, null, true)
  },
  godetail: function(event) {
    let _itemid = event.currentTarget.dataset.itemid
    wx.navigateTo({
      url: '../wxpage/wxpage?type=itemdetails&itemid=' + _itemid
    })
  },
  onPageScroll:function(e){
      for(let i = 0; i < this.data.arrHeight.length; i++){
        if(this.data.arrHeight[i] < e.scrollTop + app.globalData.winHeight){
          if(this.data.imgShowArr[i] == false){
            this.data.imgShowArr[i] = true;
          }
        }
      }
      this.setData({imgShowArr: this.data.imgShowArr})
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    // console.log('statr')
    this.setData({
      page: 1,
    })
    this.getListData()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(this.data.arrivebottom)
    if (this.data.arrivebottom == false){
      this.getListData('showloading');
    }
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (options) {
    return {
      title: '泰然城分享',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})