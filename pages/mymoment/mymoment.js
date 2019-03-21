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
    pagetitle: '我的动态',
    tab:0,

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '我的动态',
    })
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({ //
      url: "https://track.huiur.com/api/track",
      data: {

      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var footarr = res.data;
        var exitarr = [];
        var comparr = [];
        footarr.forEach(function (item, index, arr) {
          if (item.status==0){
            exitarr.push(item)
          }else{
            comparr.push(item)
          }
        });
        console.log(exitarr);
        console.log(comparr);
        that.setData({
          footarr: footarr,
          exitarr: exitarr,
          comparr: comparr
        })
      }
    })

  },
  jumpexit: function () {
    wx.navigateTo({
      url: '../exitfoot/exitfoot',
    })
  },
  jumpexitit: function (e) {
    if (this.data.lock) {
      return;
    }
    console.log('触发了 tap')
    console.log(e);
    var id = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    var cover = e.currentTarget.dataset.cover;
    wx.navigateTo({
      url: '../makelist/makelist?id=' + id + '&cover=' + cover + '&title=' + title,
    })
  },
  jumpfixit:function(e){
    if (this.data.lock) {
      return;
    }
    console.log('触发了 tap')
    console.log(e);
    var id = e.currentTarget.dataset.xid;
    var title = e.currentTarget.dataset.title;
    var cover = e.currentTarget.dataset.cover;
    wx.navigateTo({
      url: '../makelist/makelist?id=' + id + '&cover=' + cover + '&title=' + title,
    })
  },
  tabtap:function(e){
    var tab = e.currentTarget.dataset.tab;
    this.setData({
      tab: tab
    })
  },

  deletefoot: function (e) {
    this.setData({ lock: true });
    console.log('触发了 longtap')
    console.log(e);
    var id = e.currentTarget.id;
    var that = this;
    var token = wx.getStorageSync('token');
    wx.showActionSheet({
      itemList: ['删除'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.request({ //
            url: "https://track.huiur.com/api/track/" + id,
            data: {

            },
            method: 'DELETE',
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            success: function (ores) {
              console.log(ores);
              wx.request({ //
                url: "https://track.huiur.com/api/track",
                data: {

                },
                method: 'GET',
                header: {
                  'content-type': 'application/json',
                  'Authorization': 'Bearer ' + token,
                },
                success: function (tres) {
                  console.log(tres);
                  var footarr = tres.data;
                  that.setData({
                    footarr: footarr
                  })
                  wx.showToast({
                    title: '删除成功',
                  })
                }
              })
            }
          })
          this.setData({ lock: false });
        } else {
          this.setData({ lock: false });
        }
        this.setData({ lock: false });
      }
    })

  },
  deletefoote:function(e){
    console.log(e);
    var id = e.currentTarget.id;
    var that = this;
    var token = wx.getStorageSync('token');
    wx.showActionSheet({
      itemList: ['删除'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.request({ //
            url: "https://track.huiur.com/api/track/" + id,
            data: {

            },
            method: 'DELETE',
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            success: function (ores) {
              console.log(ores);
              wx.request({ //
                url: "https://track.huiur.com/api/track",
                data: {

                },
                method: 'GET',
                header: {
                  'content-type': 'application/json',
                  'Authorization': 'Bearer ' + token,
                },
                success: function (tres) {
                  console.log(tres);
                  var footarr = tres.data;
                  var exitarr = [];
                  var comparr = [];
                  footarr.forEach(function (item, index, arr) {
                    if (item.status == 0) {
                      exitarr.push(item)
                    } else {
                      comparr.push(item)
                    }
                  });
                  console.log(exitarr);
                  console.log(comparr);
                  that.setData({
                    footarr: footarr,
                    exitarr: exitarr,
                    comparr: comparr
                  })
                  wx.showToast({
                    title: '删除成功',
                  })
                }
              })
            }
          })
     
        } else {
          
        }
        
      }
    })
  },
  getUserInfo: function (e) {
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
  }
})
