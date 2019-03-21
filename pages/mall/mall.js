// pages/mall/mall.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls:[
      {
        src:'https://track.huiur.com/images/mallbanner01.png',
        id:1,
      },
      {
        src: 'https://track.huiur.com/images/mallbanner02.png',
        id: 2,
      }
    ],
    routearr:[],
    pages:1,
    shownav:false,
    pagetitle:'商城',
    intentimg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.hideShareMenu();
    that.setData({
      intentimg: 'https://track.huiur.com/images/mallbanner02.png?'+ Math.random() / 9,
    })
      wx.request({ //
        url: "https://track.huiur.com/api/road",
        data: {
          placeid: 6,
          pages:1,
          limit:5
        },
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);
          for (let i = 0; i < res.data.length;i++){
            res.data[i].price = parseFloat(res.data[i].price)
          }
          that.setData({
            routearr:res.data
          })
        }
      })
      wx.request({ //
        url: "https://track.huiur.com/api/banner",
        data: {

        },
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);
          
          that.setData({
            imgUrls: res.data
          })
        }
      })
    
    
  },
  routetap:function(){
    wx.navigateTo({
      url: '../routebook/routebook',
    })
  },
  jumpintent:function(){
    wx.navigateTo({
      url: '../personalize/personalize',
    })
  },
  singtap:function(e){
    var rid = e.currentTarget.id;
    wx.navigateTo({
      url: '../journeydetail/journeydetail?id=' + rid,
    })
  },
  visatap:function(){
    wx.navigateTo({
      url: '../visa/visa',
    })
  },
  placetap:function(){
    wx.navigateTo({
      url: '../place/place',
    })
  },
  jumpper:function(){
    wx.navigateTo({
      url: '../personalize/personalize',
    })
  },
  swipertap:function(e){
    console.log(e);
    var cid = e.currentTarget.dataset.cid;
    if(cid==1){ //视频集锦
        wx.navigateTo({
          url: '../ablum/ablum',
        })
    }else{
      wx.navigateTo({
        url: '../ranking/ranking',
      })
    }
  },
  addprinttap: function () {
    if (this.data.spared == true) {
      wx.navigateTo({
        url: '../personalize/personalize',
      })
    } else {
      this.setData({
        foright: '0rpx',
        spared: true
      })
    }
  },
  lefaddprint: function () {
    if (this.data.spared == true) {
      this.setData({
        foright: '-138rpx',
        spared: false
      })
    } else {
      this.setData({
        foright: '0rpx',
        spared: true
      })
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
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      pages:1
    })
    if (token) {
      wx.request({ //
        url: "https://track.huiur.com/api/road",
        data: {
          placeid: 6,
          pages: 1,
          limit: 5
        },
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].price = parseFloat(res.data[i].price)
          }
          that.setData({
            routearr: res.data
          })
        }
      })

      wx.request({ //
        url: "https://track.huiur.com/api/count",
        data: {
          pages:'首页',
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {

        }
      })
    } else { //没有登录
      wx.navigateTo({
        url: '../login/login?link=1',
      })
    }
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
    var pages = this.data.pages + 1;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({ //
      url: "https://track.huiur.com/api/road",
      data: {
        placeid: 6,
        pages: pages,
        limit: 5
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var routearr = res.data;
        var now = that.data.routearr;
        console.log(routearr);
        console.log(now);
        var newarr = now.concat(routearr);
        for (let i = 0; i < newarr.length; i++) {
          newarr[i].price = parseFloat(newarr[i].price)
        }
        that.setData({
          routearr: newarr,
          pages: pages
        })
      }
    })
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '懒游星球，一键定制，专人服务！',
      imageUrl: 'https://track.huiur.com/images/shareimg.png',
      path: '/pages/mall/mall',
    }
  }
})