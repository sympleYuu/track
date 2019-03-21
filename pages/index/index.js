//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lock: false,
    pages:1,
    status:0,
    page:1,
    shownav:false,
    pagetitle:'广场',
    tab:0,
    topbanner: ['https://track.huiur.com/images/topbannert1.png?' + Math.random() / 9, 'https://track.huiur.com/images/topbannert2.png?' + Math.random() / 9],
    topupshow:true,
    foright: '0rpx',
    spared: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '广场',
    })
    var that = this;
    that.setData({
      navH: app.globalData.navHeight,
      
      uptopimg: 'https://track.huiur.com/images/topupt1.png?' + Math.random() / 9,
    })
    var token = wx.getStorageSync('token');
    if (token) {
      wx.request({ //
        url: "https://track.huiur.com/api/alltrack",
        data: {
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
          var footarr = res.data;
          that.setData({
            footarr: footarr
          })

        }
      })
      wx.request({ //
        url: "https://track.huiur.com/api/piazzalist",
        data: {
        },
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);
          var datas = res.data;
          that.setData({
            ablumarr: datas
          })
        }
      })
    }else{ //没有登录
      wx.navigateTo({
        url: '../login/login?link=1',
      })
    }
    // wx.hideShareMenu();
      
  
  },
  jumpactivity:function(){
    wx.navigateTo({
      url: '../activity/activity',
    })
  },

  closebtntap:function(){
    this.setData({
      topupshow:false,
    })
  },
  reload:function(){

  },
  jumpexitfoot:function(){
    wx.navigateTo({
      url: '../exitfoot/exitfoot',
    })
  },
  indextab:function(e){
    var tab = e.currentTarget.dataset.tab;
    this.setData({
      tab:tab
    })
  },
  jumpexit:function(){ //exit的入口
    wx.navigateTo({
      url: '../ranking/ranking',
    })
  },
  thumptap:function(e){
    console.log(e);
    var fid = e.currentTarget.dataset.fid;
    var that = this;
    var token = wx.getStorageSync('token');
    
    wx.request({ //
      url: "https://track.huiur.com/api/like/" + fid,
      data: {
        status: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var num = res.data.like;
        var footarr = that.data.footarr;
        if (res.statusCode == 200) {
          let currentIndex = footarr.findIndex(item => item.id === fid);
          that.setData({
            ['footarr[' + currentIndex + '].islike']: '1',
            ['footarr[' + currentIndex + '].like']: num,
          })
        }
      }
    })
  },
  unthumptap: function (e) {
    console.log(e);
    var fid = e.currentTarget.dataset.fid;
    var that = this;
    var token = wx.getStorageSync('token');

    wx.request({ //
      url: "https://track.huiur.com/api/like/" + fid,
      data: {
        status: 0
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var num = res.data.like
        var footarr = that.data.footarr;
        if (res.statusCode == 200) {
          let currentIndex = footarr.findIndex(item => item.id === fid);
          that.setData({
            ['footarr[' + currentIndex + '].islike']: '0',
            ['footarr[' + currentIndex + '].like']: num,
          })
        }
      }
    })
  },

  
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  touchend: function () {
    if (this.data.lock) {
      //开锁
      setTimeout(() => {
        this.setData({ lock: false });
      }, 100);
    }
  },
  addprint:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({ //
      url: "https://track.huiur.com/api/notrack",
      data: {
       
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        if(res.data==0){
          wx.navigateTo({
            url: '../exitfoot/exitfoot',
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '您有未发布的足迹，是否继续编辑？',
            cancelText: '否',
            confirmText: '是',
            cancelColor: '#575757',
            confirmColor: '#f78516',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../mymoment/mymoment',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.navigateTo({
                  url: '../exitfoot/exitfoot',
                })
              }
            }
          })
        }
      }
    })
    
    
  },
  addprinttap: function () {
    if (this.data.spared == true) {
      wx.navigateTo({
        url: '../exitfoot/exitfoot',
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
  jumpdetail:function(e){
    if (this.data.lock) {
      return;
    }
    console.log('触发了 tap')
    console.log(e);
    var id = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    var cover = e.currentTarget.dataset.cover;
    wx.navigateTo({
      url: '../footshow/footshow?id=' + id + '&cover=' + cover +'&title='+title,
    })
  },
  sharetap:function(e){ //分享
    var fid = e.currentTarget.dataset.fid;
    console.log(fid);
    var that = this;
    var token = wx.getStorageSync('token');
    var footarr = that.data.footarr;
    let currentIndex = footarr.findIndex(item => item.id === fid);
    console.log(currentIndex);
    var stitle = footarr[currentIndex].title;
    var scover = footarr[currentIndex].banner;
    that.setData({
      sharefid: fid,
      sharetitle: stitle,
      sharecover: scover
    })
    
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var pages = this.data.pages+1;
    var token = wx.getStorageSync('token');
    var that = this;
      wx.request({ //
        url: "https://track.huiur.com/api/alltrack",
        data: {
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
          if (res.statusCode == 200) {
            var footarr = res.data;
            var now = that.data.footarr;
            console.log(footarr);
            console.log(now);
            var newarr = now.concat(footarr);
            that.setData({
              footarr: newarr,
              pages: pages
            })
          }


        }
      })
    
    
  },
  onShow:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      pages: 1
    })
    wx.hideShareMenu();
    if(token){
      wx.request({ //
        url: "https://track.huiur.com/api/alltrack",
        data: {
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
          var footarr = res.data;
          that.setData({
            footarr: footarr
          })

        }
      })
    }
    
    wx.request({ //
      url: "https://track.huiur.com/api/piazzalist",
      data: {
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var datas = res.data;
        that.setData({
          ablumarr: datas
        })
      }
    })
    wx.request({ //
      url: "https://track.huiur.com/api/count",
      data: {
        pages: '广场',
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {

      }
    })
    wx.request({ //
      url: "https://track.huiur.com/api/status",
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
          status:res.data
        })

      }
    })
  },
  ablumtap: function (e) {
    console.log(e);
    var aid = e.currentTarget.id;
    var title = e.currentTarget.dataset.tit;
    wx.navigateTo({
      url: '../videolist/videolist?id=' + aid + "&title=" + title,
    })
  },
  onShareAppMessage: function (res) {
    console.log(res);
    var that = this;
    var fid = res.target.dataset.fid;
    console.log(fid);
    var token = wx.getStorageSync('token');
    wx.request({ //
      url: "https://track.huiur.com/api/share",
      data: {
        trackid: fid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
      }
    })
    
    var footarr = that.data.footarr;
    let currentIndex = footarr.findIndex(item => item.id === fid);
    console.log(currentIndex);
    var stitle = footarr[currentIndex].title;
    var scover = footarr[currentIndex].banner;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: stitle,
      imageUrl: 'https://track.huiur.com/' + scover,
      path: '/pages/footshow/footshow?id=' + fid,
    }
  }
})
