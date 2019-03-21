// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check: 1,
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    this.setData({
      link:options.link
    })
    if(options.fid){
      this.setData({
        fid: options.fid
      })
    }
    if (options.rid) {
      this.setData({
        rid: options.rid
      })
    }
    if (options.sence == 'true') {
      this.setData({
        sence: true
      })
    }
    var token = wx.getStorageSync('token');
    if (token) {
      wx.switchTab({
        url: '../index/index',
      })
     
    }
    wx.getSetting({
      success: function (res) {
        console.log(res);
        var token = wx.getStorageSync('token');
        if (res.authSetting['scope.userInfo']) {
          console.log('用户已经授权');
          var token = wx.getStorageSync('token');
          if (token) {
            // wx.switchTab({
            //   url: '../index/index'
            // })
            // var pages = getCurrentPages();
            // var prevPage = pages[pages.length - 2];
            // prevPage.reLoad();
            // wx.navigateBack({
            //   delta: 1
            // })
            // wx.navigateTo({
            //   url: '../index/index',
            //   success: function (e) {
            //     console.log('跳转成功')
            //     var page = getCurrentPages().pop();
            //     if (page == undefined || page == null) return;
            //     // var options = {
            //     //   scene : '1%2C3'
            //     // }
            //     var e = {
            //       scode: true
            //     }
            //     if (that.data.sence == true) {
            //       page.reLoad(e);
            //     } else {
            //       // page.reLoad();
            //     }
            //   }
            // })
            // wx.getUserInfo({
            //   success: function (res) {
            //     //从数据库获取用户信息
            //     that.queryUsreInfo();
            //     //用户已经授权过
            //     wx.switchTab({
            //       url: '../index/index'
            //     })
            //   }
            // });
          }
        }
      }
    })

  },
  getuserinfo: function (e) {
    console.log(e);
    var that = this;
    var rawData = e.detail.rawData;
    var rawDataToObj = JSON.parse(rawData);
    console.log(rawDataToObj);
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        wx.request({
          url: "https://track.huiur.com/api/wxlogin",
          data: {
            code: res.code,
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (ores) {
            console.log(ores);
            wx.request({
              url: "https://track.huiur.com/api/login",
              data: {
                openid: ores.data.openid,
                // password: 'youyue'
              },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success: function (tres) {
                console.log(tres);

                if (tres.data.code == '002') {
                  // Register(res.data.openid, 'youyue')
                  console.log('未注册')
                  rawDataToObj.openid = ores.data.openid;
                  wx.request({
                    url: "https://track.huiur.com/api/register",
                    data: rawDataToObj,
                    // {
                    //   rawData: rawDataToObj,
                    //   // openid: ores.data.openid,
                    // },
                    method: 'POST',
                    header: {
                      'content-type': 'application/json',
                      'Authorization': 'Bearer ',
                    },
                    success: function (qres) {
                      console.log(qres);
                      var token = qres.data.token;
                      if (token) {
                        wx.setStorageSync('token', qres.data.token);
                        that.jumplink();
                        // wx.switchTab({
                        //   url: '../index/index',
                        //   success: function (e) {
                        //     console.log('跳转成功')
                        //     var page = getCurrentPages().pop();
                        //     if (page == undefined || page == null) return;
                        //     // var options = {
                        //     //   scene : '1%2C3'
                        //     // }
                        //     var e = {
                        //       scode: true
                        //     }
                        //     if (that.data.sence == true) {
                        //       page.reLoad(e);
                        //     } else {
                        //       // page.reLoad();
                        //     }

                        //   }
                        // })
                      }
                    }
                  })
                } else {
                  console.log('已注册');
                  var token = tres.data.token;
                  wx.setStorageSync('token', token);
                  wx.setStorageSync('nickname', rawDataToObj.nickName);
                  wx.setStorageSync('photo', rawDataToObj.avatarurl);
                  that.jumplink();
                  // wx.switchTab({
                  //   url: '../index/index',
                  //   success: function (e) {
                  //     console.log('跳转成功')
                  //     var page = getCurrentPages().pop();
                  //     if (page == undefined || page == null) return;
                  //     // var options = {
                  //     //   scene : '1%2C3'
                  //     // }
                  //     var e = {
                  //       scode: true
                  //     }
                  //     if (that.data.sence == true) {
                  //       page.reLoad(e);
                  //     } else {
                  //       // page.reLoad();
                  //     }

                  //   }
                  // })
                }

              }
            })

          }
        })
      },
    })
  },
  jumplink:function(){ //首页商城
    var link = this.data.link;
    var that = this;
    switch (link){
      case '1':
        wx.switchTab({
          url: '../index/index',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
      break;
      case '2':
        wx.reLaunch({
          url: '../footshow/footshow?id='+that.data.fid,
        })
      break;
      case '3':
        wx.reLaunch({
          url: '../journeydetail/journeydetail?id=' + that.data.rid,
        })
        break;
    }
  },
  checklogin: function () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        wx.request({
          url: "https://track.huiur.com/api/wxlogin",
          data: {
            code: res.code,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res);
            wx.request({
              url: "https://track.huiur.com/api/login",
              data: {
                openid: res.data.openid,
                password: 'youyue'
              },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success: function (ores) {
                console.log(ores);

                if (ores.data.mes == '请先注册') {
                  // Register(res.data.openid, 'youyue')
                  console.log('未注册')
                  return false;
                  // wx.navigateTo({
                  //   url: '../login/login?openid=' + res.data.openid,
                  // })
                } else {
                  console.log('已注册');
                  var api_token = ores.data.data.api_token;
                  var user_id = ores.data.data.id;
                  wx.setStorageSync('token', api_token);
                  wx.setStorageSync('user_id', user_id);
                  wx.setStorageSync('nickname', ores.data.data.nickName);
                  wx.setStorageSync('photo', ores.data.data.avatarurl);
                  return true;
                }

              }
            })
          }
        })
      }
    })
  },
  dealjump: function () {
    wx.navigateTo({
      url: '../userdeal/userdeal',
    })
  },
  checktap: function () {
    this.setData({
      check: 1
    })
  },
  checkedtap: function () {
    console.log('同意')
    this.setData({
      check: 0
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