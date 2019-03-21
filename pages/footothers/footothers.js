// pages/footothers/footothers.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myfootarr:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var uid = options.id;
  var that = this;
  wx.setNavigationBarColor({
    frontColor: '#000000',
    backgroundColor: '#fbc800',
  })
  wx.request({
    url: "https://youyue.huiur.com/myflayerfoot", //我的足迹
      method: "POST",
        header: {
      'content-type': 'application/json'
    },
  data: {
    user_id: uid,
    page: 1
  },
  success: function (res) {
    console.log(res);
    var datas = res.data.data;
    console.log(datas);
    if (datas.length == 0) {
      wx.request({
        url: "https://youyue.huiur.com/myumessage", //我的足迹列表为空，我的个人信息 
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          user_id: user_id,
        },
        success: function (res) {
          console.log(res);
          that.setData({
            footnum: 0,
            myname: app.limitwords(res.data.data.user_nickname),
            myheader: res.data.data.header,
            sex: res.data.data.sex,
            mydefault: true,
          })
        }
      })
    } else {
      var footnum = datas.length;
      var myname = app.limitwords(datas[0].user_nickname);
      var myheader = datas[0].header;
      var mysex = datas[0].sex
      that.setData({
        myfootarr: datas,
        footnum: footnum,
        myname: myname,
        myheader: myheader,
        sex: mysex
      })
    }

  }
})
  },
  myfootjump: function (e) {
    console.log(e);
    var myfootid = e.currentTarget.id;
    wx.navigateTo({
      url: '../footdetail/footdetail?id=' + myfootid,
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