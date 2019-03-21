// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab:0,
    messarr01:[],
    messarr02:[],
    pagetitle: '我的消息',
    pages1:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的消息',
    })
    var token = wx.getStorageSync('token');
    var that = this;

    wx.request({ //
      url: "https://track.huiur.com/api/message/system",
      data: {
        pages:1,
        limit: 10
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var mess01 = res.data.system;
        
        that.setData({
          messarr01: mess01,
          likemes: res.data.likemes,
          sysmes: res.data.sysmes
        })
      }
    })
    
  },
  jumpfoot:function(e){ //跳转足迹详情
    var fid = e.currentTarget.dataset.fid;
    wx.navigateTo({
      url: '../footshow/footshow?id=' + fid,
    })
  },
  messtab:function(e){
    var tab = e.currentTarget.dataset.tab;
    this.setData({
      tab:tab
    })
    var token = wx.getStorageSync('token');
    var that = this;
    if(tab==1){
      wx.request({ //
        url: "https://track.huiur.com/api/message/likes",
        data: {
          pages: 1,
          limit: 10
        },
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);
          var mess02 = res.data;
          that.setData({
            messarr02: mess02
          })
        }
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
    var tab = this.data.tab;
    if(tab==0){
      var pages = this.data.pages1;
      console.log(pages);
      var token = wx.getStorageSync('token');
      var that = this;
      wx.request({ //
        url: "https://track.huiur.com/api/message/system",
        data: {
          pages: pages+1,
          limit: 10
        },
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);
          var mess01 = res.data.system;
          var messarr = that.data.messarr01;
          var newarr = messarr.concat(mess01);
          
          that.setData({
            messarr01: newarr,
            likemes: res.data.likemes,
            sysmes: res.data.sysmes,
            pages1: pages+1,
          })
        }
      })

    }
  }
})