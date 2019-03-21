// pages/ablum/ablum.js
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
    pages: 1,
    status: 0,
    page: 1
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '视频集锦',
    })
    var that = this;
    var token = wx.getStorageSync('token');
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



  },
  ablumtap: function (e) {
    console.log(e);
    var aid = e.currentTarget.id;
    var title = e.currentTarget.dataset.tit;
    wx.navigateTo({
      url: '../videolist/videolist?id=' + aid + "&title=" + title,
    })
  },

  reload: function () {

  },
  playvedtap: function (e) { //点击播放视频
    console.log(e);
    var vid = parseInt(e.currentTarget.id);
    var videolist = this.data.videolist;
    let currentIndex = videolist.findIndex(item => item.id === vid);
    var nowid = this.data.isplayid;
    let currentIndex2 = videolist.findIndex(item => item.id === nowid);
    console.log(nowid);
    if (nowid) {
      this.setData({
        ['videolist[' + currentIndex + '].isplay']: true,
        ['videolist[' + currentIndex2 + '].isplay']: false,
        isplayid: vid,
      })
    } else {
      this.setData({
        ['videolist[' + currentIndex + '].isplay']: true,
        isplayid: vid,
      })
    }

  },
  thumptap: function (e) {
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
        var footarr = that.data.footarr;
        if (res.statusCode == 200) {
          let currentIndex = footarr.findIndex(item => item.id === fid);
          that.setData({
            ['footarr[' + currentIndex + '].islike']: '1'
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
        var footarr = that.data.footarr;
        if (res.statusCode == 200) {
          let currentIndex = footarr.findIndex(item => item.id === fid);
          that.setData({
            ['footarr[' + currentIndex + '].islike']: '0'
          })
        }
      }
    })
  },
  jumpexit: function () {
    wx.navigateTo({
      url: '../exitfoot/exitfoot',
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
  jumpdetail: function (e) {
    if (this.data.lock) {
      return;
    }
    console.log('触发了 tap')
    console.log(e);
    var id = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    var cover = e.currentTarget.dataset.cover;
    wx.navigateTo({
      url: '../footshow/footshow?id=' + id + '&cover=' + cover + '&title=' + title,
    })
  },
  sharetap: function (e) { //分享
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


  }
})
