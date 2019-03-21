// pages/ranking/ranking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagetitle: '懒游星球',
    eventimg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    var that = this;
    that.setData({
      eventimg: 'https://track.huiur.com/images/eventimg01.jpg?' + Math.random() / 9,
    })
    wx.request({ //
      url: "https://track.huiur.com/api/raking",
      data: {
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var rankarr = res.data.ranking;
        that.setData({
          rankarr: rankarr,
          meitem: res.data.me[0]
        })
      }
    })
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

  }

  /**
   * 用户点击右上角分享
   */

})