var app = getApp();
// pages/list_first/list_first.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagetitle: "",
    vedArr: [],
    thumpimg: "../../images/hotv_ico01.png",
    topimg: '',
    topbrief: '',
    options_ad: '',
    rid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onloadddd')
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var latitude = wx.getStorageSync('_lat');  //获取当前定位数据缓存 坐标lat
    var longitude = wx.getStorageSync('_log');
    if (options.address) {
      that.setData({
        options_ad: options.address,
        rid: options.id
      })
    } else {
      that.setData({
        options_ad: '',
        rid: options.id
      })
    }
    wx.removeStorageSync('pagere');
    wx.removeStorageSync('pageex');
    if (options.address) {
      wx.request({
        url: "https://youyue.huiur.com/getrelevant",
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          // rid: options.id,
          // uid: user_id,
          // address: options.address,
          // page: 1,
          // latitude: latitude,
          // longitude: longitude
          latitude:39.9219,
          longitude:116.44355,
          page:1,
          rid:8,
          uid:84

        },
        success: function (res) {
          var datas = res.data;
          var newvedArr = [];
          var i = 0;
          for (i = 0; i < datas.length; i++) {
            var newurl = '';
            var v_url = datas[i].video_url;
            var urlstr = v_url.substring(0, 4);
            if (urlstr == 'http') {
              newurl = v_url
            } else {
              newurl = "http://yue.frrrd.xyz" + v_url;
              
            }
            var dis = '';
            var distance = datas[i].dis;
            if (distance < 1000) {
              dis = parseInt(distance) + 'm';
            } else {
              var dist = distance / 1000;
              dis = dist.toFixed(1) + 'km'
            }
            newvedArr.push({
              playstate: 0,
              region: datas[i].region,
              video_url: newurl,
              user_nickname: app.limitwords(datas[i].user_nickname),
              header: datas[i].header,
              title: datas[i].title,
              click: datas[i].click,
              comment: datas[i].comment,
              id: datas[i].id,
              user_id: datas[i].user_id,
              isclick: datas[i].isclick,
              display: "block",
              btndisplay: "block",
              img_url: datas[i].img_url,
              create_time: datas[i].create_time,
              dis: dis,
              play_count: datas[i].play_count
            })
          }
          that.setData({
            vedArr: newvedArr,
            pagetitle: options.address
          })
          //绑定列表所有视频组件
          var vedataList = that.data.vedArr;
          var v = 0;
          // for (v = 0; v < vedataList.length; v++){
          //   var vedId = vedataList[v].id.toString();
          //   that.videoContext = wx.createVideoContext(vedId);
          // }
          var _data = that.data
          wx.setNavigationBarTitle({
            title: that.data.pagetitle + "热门视频"//页面标题为路由参数
          })
        }
      })
    } else {
      wx.request({
        url: "https://youyue.huiur.com/explore_detail",
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          // rid: options.id,
          // uid: user_id,
          // page: 1,
          // latitude: latitude,
          // longitude: longitude
          latitude: 39.9219,
          longitude: 116.44355,
          page: 1,
          rid: 8,
          uid: 84
        },
        success: function (res) {
          var datas = res.data.data;
          var newvedArr = [];
          var i = 0;
          for (i = 0; i < datas.length; i++) {
            var newurl = '';
            var v_url = datas[i].video_url;
            var urlstr = v_url.substring(0, 4);
            if (urlstr == 'http') {
              newurl = v_url
            } else {
              newurl = "http://yue.frrrd.xyz" + v_url;
            }
            var dis = '';
            var distance = datas[i].dis;
            if (distance < 1000) {
              dis = parseInt(distance) + 'm';
            } else {
              var dist = distance / 1000;
              dis = dist.toFixed(1) + 'km'
            }
            newvedArr.push({
              playstate: 0,
              region: datas[i].region,
              video_url: newurl,
              user_nickname: app.limitwords(datas[i].user_nickname),
              header: datas[i].header,
              title: datas[i].title,
              click: datas[i].click,
              comment: datas[i].comment,
              id: datas[i].id,
              user_id: datas[i].user_id,
              isclick: datas[i].isclick,
              display: "block",
              btndisplay: "block",
              img_url: datas[i].img_url,
              create_time: datas[i].create_time,
              dis: dis,
              play_count: datas[i].play_count
            })

          }
          that.setData({
            vedArr: newvedArr,
            pagetitle: datas[0].region,
            topbrief: datas[0].description,
            topimg: datas[0].img_urls
          })
          //绑定列表所有视频组件
          var vedataList = that.data.vedArr;
          var v = 0;
          // for (v = 0; v < vedataList.length; v++){
          //   var vedId = vedataList[v].id.toString();
          //   that.videoContext = wx.createVideoContext(vedId);
          // }
          var _data = that.data
          wx.setNavigationBarTitle({
            title: that.data.pagetitle + "热门视频"//页面标题为路由参数
          })
        }
      })
    }

    // that.setData({
    //   pagetitle: options.mername//options为页面路由过程中传递的参数
    // })

  },
  catchthump: function (e) {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var video_id = e.currentTarget.dataset.video_id;
    var oid = e.currentTarget.dataset.user_id;
    // var sessionkey = "sessionkey";
    // var ret_value = app.get(sessionkey, 'default');
    // if (ret_value == "default") { //未登录或登录信息过期
    //   wx.switchTab({
    //     url: '../mine/mine',
    //   })
    // } else { //已登录
    wx.request({
      url: "https://youyue.huiur.com/click",
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        uid: user_id,
        vid: e.currentTarget.dataset.video_id,
        mid: oid,
      },
      success: function (res) {
        if (res.data == 1 || res.data == 0) {
          var relay_status = that.data.vedArr;
          var i = 0;
          for (i = 0; i < relay_status.length; i++) {
            if (relay_status[i].id == video_id) {
              var newclick = parseInt(that.data.vedArr[i].click) + 1;
              that.setData({
                ['vedArr[' + i + '].isclick']: 1,
                ['vedArr[' + i + '].click']: newclick
              })
            }
          }
        }
      }
    })
  },
  videochange: function (e) {
    console.log(e);
    var hotarr = this.data.vedArr;
    var user_id = wx.getStorageSync('user_id');
    var hId = parseInt(e.currentTarget.id);
    var vid = e.currentTarget.id;
    var oid = e.currentTarget.dataset.oid;
    console.log(user_id);
    console.log(oid);
    wx.request({
      url: "https://youyue.huiur.com/play_count",
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data:{        
        other_id: oid,
        user_id: user_id,
        id: vid,
      },
      success: function(res){
        console.log(res);
      }
    })
    let currentIndex = hotarr.findIndex(item => item.id === hId);
    let playIndex = hotarr.findIndex(item => item.playstate === 1);
    if (playIndex == '-1') {

    } else {
      this.setData({
        ['vedArr[' + playIndex + '].playstate']: 0
      })
    }

    this.setData({
      ['vedArr[' + currentIndex + '].playstate']: 1
    })
    
  },
  vedend: function (e) {
    var user_id = wx.getStorageSync('user_id');
    var video_id = e.target.id;
    wx.request({
      url: "https://youyue.huiur.com/addplayvideo",
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        user_id: user_id,
        video_id: video_id,
      },
      success: function (res) {
      }
    })
  },
  catchcancel: function (e) {
    return false;
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
    var page_re = wx.getStorageSync('pagere');
    var latitude = wx.getStorageSync('_lat');  //获取当前定位数据缓存 坐标lat
    var longitude = wx.getStorageSync('_log');
    console.log('-8---' + page_re);
    if (page_re) {

    } else {
      page_re = 2;
    }
    console.log('-88---' + page_re);
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    if (this.data.options_ad) {
      wx.request({
        url: "https://youyue.huiur.com/getrelevant",
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          rid: that.data.rid,
          uid: user_id,
          address: options.address,
          page: page_re,
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) {
          var page = page_re + 1;
          wx.setStorageSync('pagere', page)
          var datas = res.data;
          var exixtArr = that.data.vedArr;
          var i = 0;
          for (i = 0; i < datas.length; i++) {
            var dis = '';
            var distance = datas[i].dis;
            if (distance < 1000) {
              dis = parseInt(distance) + 'm';
            } else {
              var dist = distance / 1000;
              dis = dist.toFixed(1) + 'km'
            }
            exixtArr.push({
              playstate: 0,
              region: datas[i].region,
              video_url: datas[i].video_url,
              user_nickname: datas[i].user_nickname,
              header: datas[i].header,
              title: datas[i].title,
              click: datas[i].click,
              comment: datas[i].comment,
              id: datas[i].id,
              user_id: datas[i].user_id,
              isclick: datas[i].isclick,
              display: "block",
              btndisplay: "block",
              img_url: datas[i].img_url,
              create_time: datas[i].create_time,
              dis: dis,
              play_count: datas[i].play_count
            })

          }
          that.setData({
            vedArr: exixtArr,
            pagetitle: options.address
          })
          //绑定列表所有视频组件
          var vedataList = that.data.vedArr;
          var v = 0;
          // for (v = 0; v < vedataList.length; v++){
          //   var vedId = vedataList[v].id.toString();
          //   that.videoContext = wx.createVideoContext(vedId);
          // }
          var _data = that.data
          wx.setNavigationBarTitle({
            title: that.data.pagetitle + "热门视频"//页面标题为路由参数
          })
        }
      })
    } else {
      var page_ex = wx.getStorageSync('pageex');
      console.log('-7---' + page_ex);
      if (page_ex) {

      } else {
        page_ex = 2;
      }
      console.log('-77---' + page_ex);
      wx.request({
        url: "https://youyue.huiur.com/explore_detail",
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          rid: that.data.rid,
          uid: user_id,
          page: page_ex,
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) {
          var page2 = page_ex + 1;
          wx.setStorageSync('pageex', page2)
          var datas = res.data.data;
          var exixtArr = that.data.vedArr;
          
          var i = 0;
          for (i = 0; i < datas.length; i++) {
            var dis = '';
            var distance = datas[i].dis;
            if (distance < 1000) {
              dis = parseInt(distance) + 'm';
            } else {
              var dist = distance / 1000;
              dis = dist.toFixed(1) + 'km'
            }
            exixtArr.push({
              playstate: 0,
              region: datas[i].region,
              video_url: datas[i].video_url,
              user_nickname: datas[i].user_nickname,
              header: datas[i].header,
              title: datas[i].title,
              click: datas[i].click,
              comment: datas[i].comment,
              id: datas[i].id,
              user_id: datas[i].user_id,
              isclick: datas[i].isclick,
              display: "block",
              btndisplay: "block",
              img_url: datas[i].img_url,
              create_time: datas[i].create_time,
              dis: dis,
              play_count: datas[i].play_count
            })

          }
          that.setData({
            vedArr: exixtArr,
            pagetitle: datas[0].region,
            topbrief: datas[0].description,
            topimg: datas[0].img_urls
          })
          //绑定列表所有视频组件
          var vedataList = that.data.vedArr;
          var v = 0;
          // for (v = 0; v < vedataList.length; v++){
          //   var vedId = vedataList[v].id.toString();
          //   that.videoContext = wx.createVideoContext(vedId);
          // }
          var _data = that.data
          wx.setNavigationBarTitle({
            title: that.data.pagetitle + "热门视频"//页面标题为路由参数
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  jumpdetal: function (e) {

    wx.navigateTo({
      url: '../list_deta/list_deta?id=' + e.currentTarget.id,
    })
  },

  videoplay: function (e) { //点击视频后 绑定当前视频组件
    var vedId = e.currentTarget.id;
    var playvedstr = wx.getStorageSync('playved');
    this.videoCtx = wx.createVideoContext(playvedstr);
    this.videoCtx.pause();
    var i = 0;
    for (i = 0; i < this.data.vedArr.length; i++) {
      if (this.data.vedArr[i].id == playvedstr) {
        this.setData({
          ['vedArr[' + i + '].display']: 'block',
          ['vedArr[' + i + '].btndisplay']: 'block',
        })
      }
    }
    wx.setStorageSync('playved', vedId);
    var vedIdstr = e.currentTarget.id.toString();
    this.videoCtx = wx.createVideoContext(vedIdstr);
    this.videoCtx.play();
    var i = 0;
    for (i = 0; i < this.data.vedArr.length; i++) {
      if (this.data.vedArr[i].id == vedId) {
        this.setData({
          ['vedArr[' + i + '].display']: 'none',
          ['vedArr[' + i + '].btndisplay']: 'none',
        })
      }
    }
  },
  play: function (x) {
    console.log(x)

    console.log(this.data.vedArr.length)



  },
  catchbtn: function () {
    return false;
  },
  catchclick: function (e) {
    console.log(e);
    var oid = e.currentTarget.dataset.user_id;
    var vid = e.currentTarget.dataset.video_id;
    var user_id = wx.getStorageSync('user_id');
    var that = this;
    wx.request({
      url: "https://youyue.huiur.com/click",
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        uid: user_id,
        vid: vid,
        mid: oid
      },
      success: function (res) {
        if (res.data == 1 || res.data == 0) {
          var relay_status = that.data.vedArr;
          var i = 0;
          for (i = 0; i < relay_status.length; i++) {
            if (relay_status[i].id == vid) {
              var newclick = parseInt(that.data.vedArr[i].click) + 1;
              that.setData({
                ['vedArr[' + i + '].isclick']: 1,
                ['vedArr[' + i + '].click']: newclick
              })
            }
          }
        }
      }
    })
  },
  startplay: function (e) {
    // wx.request({
    //   url: "https://youyue.huiur.com/play_count",
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   data: {
    //     id: e.currentTarget.dataset.vdid
    //   },
    //   success: function (res) {

    //   }
    // })
  },
  otherstap: function (e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../others_pages/others_pages?uid=' + uid,
    })
  },
  //分享转发功能
  onShareAppMessage: function (res) {
    console.log(res);
    var user_id = wx.getStorageSync('user_id');
    var video_id = res.target.id;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      
    }
    return {
      title: res.target.dataset.title,
      path: '/pages/list_deta/list_deta?id=' + res.target.id,
      success: function (res) {
        wx.request({
          url: "https://youyue.huiur.com/addshare",
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            video_id: video_id,
            user_id: user_id
          },
          success: function (res) {
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})

