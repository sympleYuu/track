// pages/makelist/makelist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    capnum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    paths:[],
    pagetitle:'友曰足迹',
    tipshow:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '友曰足迹',
    })
    var that = this;
    setTimeout(function(){
      that.setData({
      tipshow:false
      })
    },2000);
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fc9637',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    console.log(options);
    var fid = options.id;
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      footid: fid,

    })

    wx.request({ //
      url: "https://track.huiur.com/api/points",
      data: {
        trackid: fid,
        
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var footarr = res.data;
        footarr[0].track.banner = 'https://track.huiur.com' + footarr[0].track.banner;
        var percent = Math.round(footarr[0].track.finish);
        console.log(percent);
        var barWidth = 260*percent/100;
        that.setData({
          footarr: footarr,
          percent:percent,
          barWidth: barWidth,
        })
      }
    })
  },
  suggesttap: function () {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  nameblur:function(e){
    var value = e.detail.value;
    var that = this;
    console.log(value);
    var footid = that.data.footid;
    var token = wx.getStorageSync('token');
    wx.request({ //
      url: "https://track.huiur.com/api/track/" + footid,
      data: {
        title: value,
      },
      method: 'PUT',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);

        // that.setData({
        //   'footarr[0].track.title': value,
        // })
      }
    })
  },
  changecover:function(){ //修改封面图
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        wx.showLoading({
          title: '封面上传中..',
          mask: true,
        })
        const cover = res.tempFilePaths[0];
        var coverarr = [];
        coverarr.push(cover);
        console.log(coverarr);
        that.setData({
          'footarr[0].track.banner': cover,
        })
        var ret = {
          mode: 'photo',
          sort: 'cover',
          media: coverarr
        }
        console.log(ret);
        var covername = that.uploadfile(ret);
      }
    })

  },
  uploadfile: function (t) { //用户选择视频或者图片，上传至服务器 
    console.log(t);
    var that = this;
    var mode = t.mode;
    if (mode == "video") { //视频
      that.uploadved(
        {
          vedsrc: t.media,
          sid: t.sid
        }
      );
    } else if (mode == 'photo') { //图片
      var token = wx.getStorageSync('token');
      that.uploadimg({
        url: 'https://track.huiur.com/api/track',//这里是你图片上传的接口
        path: t.media,//这里是选取的图片的地址数组
        token: token,
        sort: t.sort,
        sid: t.sid,
        addupload: t.addupload
      });
      // that.uploadimg(t.media);
    }
  },
  uploadimg: function (data) {
    // wx.showLoading({
    //   title: '发布中..',
    // })
    console.log(data);
    var localfoot = this.data.localfoot;
    var paths = this.data.paths;
    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    console.log(data.path[i]);
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'files',//这里根据自己的实际情况改
      formData: {
        'token': data.token
      },//这里是上传图片时一起上传的数据
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        console.log(resp)
        paths.push(resp.data);

        console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          console.log(paths);
          that.setData({
            // imgnames: paths,
            paths: []
          })
          if (data.sort == 'cover') { //上传的是封面图
            that.coverupload(paths);
          } else { //上传的是足迹图片
            var token = wx.getStorageSync('token');
            var footarr = that.data.localfoot.footarr;
            console.log(that.data.localfoot.footarr[data.sid].imgnames)
            if (that.data.localfoot.footarr[data.sid].imgnames) {
              var newpicname = that.data.localfoot.footarr[data.sid].imgnames.concat(paths);
            } else {
              var newpicname = paths
            }

            wx.request({ //
              url: "https://track.huiur.com/api/points/" + footarr[data.sid].pointsid,
              data: {
                images: newpicname,

              },
              method: 'PUT',
              header: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
              },
              success: function (res) {
                console.log(res);

                that.setData({
                  ['localfoot.footarr[' + data.sid + '].imgnames']: paths,
                  paths: []
                })
              }
            })
            // if(data.addupload){ //点击加号上传&&已经上传过图片
            //   var newpicname = that.data.localfoot.footarr[data.sid].imgnames.concat(paths);

            //   that.setData({
            //     ['localfoot.footarr[' + data.sid + '].imgnames']: newpicname,
            //     paths: []
            //   })
            //   if (localfoot.footarr[data.sid].upload==true){ //已经上传本站，需要请求修改站点接口
            //     var change = {
            //       mode: 'images',
            //       sid: data.sid
            //     }
            //     that.changespot(change);
            //   }

            // }else{
            //   that.setData({
            //     ['localfoot.footarr[' + data.sid + '].imgnames']: paths,
            //     paths: []
            //   })
            // }

          }

        } else {//若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.setData({
            paths: paths
          })
          that.uploadimg(data);
        }

      }
    })

  },
  coverupload: function (ev) { //上传的封面图判断
    var imgname = ev;
    console.log(imgname);
    var that = this;
    var token = wx.getStorageSync('token');
    if (this.data.footid) { //存在footid,使用修改接口
      var footid = this.data.footid;
      wx.request({ //
        url: "https://track.huiur.com/api/track/" + footid,
        data: {
          banner: imgname[0]
        },
        method: 'PUT',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);
          wx.hideLoading();
        }
      })
    } else { //不存在footid，将封面图信息存到data里
      this.setData({
        'localfoot.top.covername': imgname[0],
      })
      wx.hideLoading();
    }

  },
  jumppreview:function(){
    var footid = this.data.footid;
    wx.navigateTo({
      url: '../preview/preview?id=' + footid,
    })
  },
  addpoints:function(){
    var sta = this.data.footarr.length;
    if (this.data.footarr[0].id==undefined){
      sta=0
    }
    var footid = this.data.footid;
    wx.navigateTo({
      url: '../newstation/newstation?fid=' + footid + '&sid=' + sta,
    })
  },
  deletesta:function(e){
    var that = this;
    var token = wx.getStorageSync('token');
    var footid = this.data.footid;
    var pid = e.currentTarget.dataset.pid;
    that.setData({
      pid:pid
    })
    wx.showActionSheet({
      itemList: ['删除该站'],
      success(res){
        console.log(res);
        if (res.tapIndex == 0) {
          wx.request({ //
            url: "https://track.huiur.com/api/points/" + pid,
            data: {
              trackid: footid
            },
            method: 'DELETE',
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            success: function (res) {
              console.log(res);
              if(res.statusCode==200){
                wx.showToast({
                  title: '删除成功',
                })
                that.resetfoot();
              }
              
            }
          })
        }
      }
    })
    
  },
  resetfoot:function(){
    
    var that = this;
    var fid = that.data.footid;
    var token = wx.getStorageSync('token');
    
    wx.request({ //
      url: "https://track.huiur.com/api/points",
      data: {
        trackid: fid,
    
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var footarr = res.data;
        footarr[0].track.banner = 'https://track.huiur.com' + footarr[0].track.banner;
        that.setData({
          footarr: footarr,
        })
      }
    })
  },
  jumpexit:function(e){ //进入修改站点
    console.log(e);
    var pid = e.currentTarget.id;
    var fid = this.data.footid;
    var sid = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '../newstation/newstation?fid='+fid+'&pid='+pid+'&sid='+sid+'&exit=1',
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