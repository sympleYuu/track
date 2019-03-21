// pages/journeydetail/journeydetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagetitle:'行程详情'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '行程详情',
    })
    console.log(options);
    var rid = options.id;
    this.setData({
      rid: rid
    })
    var that = this;
    var token = wx.getStorageSync('token');
    if(token){
      wx.request({ //
        url: "https://track.huiur.com/api/road/" + rid,
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
            title: datas.title,
            banner: datas.banner,
            price: parseFloat(datas.price),
            content: datas.des.content,
            des: datas.des.des,
          })
        }
      })
    }else{
    wx.navigateTo({
      url: '../login/login?link=3' + '&rid=' + rid,
    })
  }
    
  },
  jumpindent:function(){
    wx.navigateTo({
      url: '../intform/intform?id=' + this.data.rid + '&title=' + this.data.title,
    })
  },
  jumpindex:function(){
    wx.switchTab({
      url: '../mall/mall',
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
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({ //
      url: "https://track.huiur.com/api/count",
      data: {
        pages: '行程详情',
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {

      }
    })
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
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.title,
      path: '/pages/journeydetail/journeydetail?id=' + that.data.rid,
    }
  }
})