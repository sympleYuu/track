// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signed:false,
    codeshow:false,
    status:0,
  },
  jumpintention:function(){
    wx.navigateTo({
      url: '../intention/intention',
    })
  },
  jumppacket:function(){
    wx.navigateTo({
      url: '../redpacket/redpacket',
    })
  },
  jumpmessage:function(){
    wx.navigateTo({
      url: '../message/message',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的',
    })
    var token = wx.getStorageSync('token');
    var that = this;
    var date = new Date();
    var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    var day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    var today = date.getFullYear() + '-' + month + '-' + day;
    console.log(today);
    wx.request({ //
      url: "https://track.huiur.com/api/me",
      data: {
        
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.user;
        var signtime = datas.signtimesmap;
        var signed = false;
        if(signtime==today){
          signed = true;
        }else{
          signed = false;
        }
        that.setData({
          nickName: datas.nickName,
          avatarurl:datas.avatarurl,
          coin: datas.coin,
          level: datas.level,
          signed: signed,
          messagesnum: res.data.messagesnum
        })
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
          status: res.data
        })

      }
    })
  },
  signintap:function(){
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({ //
      url: "https://track.huiur.com/api/signin",
      data: {

      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        if(res.statusCode==200){ //签到成功 
          // wx.showToast({
          //   title: '签到成功!',
          // })
          that.setData({
            coin: res.data.coin,
            signed: true,
            codeshow:true
          })
        }else{

        }
        // var datas = res.data;
        // that.setData({
        //   nickName: datas.nickName,
        //   avatarurl: datas.avatarurl,
        //   coin: datas.coin,
        // })
      }
    })
  },
  codeclosebtn:function(){ //积分弹窗
    this.setData({
      codeshow:false
    })
  },
  jumpmoment:function(){
    wx.navigateTo({
      url: '../mymoment/mymoment',
    })
  },
  jumpfeedback:function(){
    wx.navigateTo({
      url: '../feedback/feedback',
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
    var token = wx.getStorageSync('token');
    var that = this;
    var date = new Date();
    var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    var day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    var today = date.getFullYear() + '-' + month + '-' + day;
    console.log(today);
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
          status: res.data
        })

      }
    })
    wx.request({ //
      url: "https://track.huiur.com/api/me",
      data: {

      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.user;
        var signtime = datas.signtimesmap;
        var signed = false;
        if (signtime == today) {
          signed = true;
        } else {
          signed = false;
        }
        that.setData({
          nickName: datas.nickName,
          avatarurl: datas.avatarurl,
          coin: datas.coin,
          level: datas.level,
          signed: signed,
          messagesnum: res.data.messagesnum
        })
      }
    })
    wx.request({ //
      url: "https://track.huiur.com/api/count",
      data: {
        pages: '我的',
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

  }
})