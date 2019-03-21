// pages/redpacket/redpacket.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagetitle: '我的钱包',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({ //
      url: "https://track.huiur.com/api/redpacketlist",
      data: {
        
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var list = res.data.list;
        var money = res.data.money/100;
        for(let i=0;i<list.length;i++){
          list[i].money = parseInt(list[i].money)/100
        }
        that.setData({
          list:list,
          money:money
        })
      }
    })
  },
  costuser:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({ //
      url: "https://track.huiur.com/api/costToUser",
      data: {

      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        if(res.data.code == '0'){
          wx.showModal({
            title: '提现成功',
            content: '提现申请已提交，将在审核通过后24小时到账',
          })
          
        } else if (res.data.code == '1012'){
          wx.showModal({
            title: '提示',
            content: '小于0.3元无法提现',
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '提现失败，请稍后再试',
          })
        }
        wx.request({ //
          url: "https://track.huiur.com/api/redpacketlist",
          data: {

          },
          method: 'GET',
          header: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          success: function (res) {
            console.log(res);
            var list = res.data.list;
            var money = res.data.money / 100;
            for (let i = 0; i < list.length; i++) {
              list[i].money = parseInt(list[i].money) / 100
            }
            that.setData({
              list: list,
              money: money
            })
          }
        })
      }
    })
  },
  costrule:function(){
    wx.navigateTo({
      url: '../costrule/costrule',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})