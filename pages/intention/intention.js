// pages/intention/intention.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    intarr:[],
    pagetitle:'我的意向'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的意向',
    })
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({ //
      url: "https://track.huiur.com/api/wishlist",
      data: {
       
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        if(res.statusCode==200){
          var intarr = res.data;
          for (let i = 0; i < intarr.length; i++) {
            intarr[i].price = parseFloat(intarr[i].price)
          }
          that.setData({
            intarr: intarr
          })
        }
        
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
})