// pages/newstation/newstation.js
var bmap = require('../../utils/bmap-wx.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgarr:[],
    paths: [],
    vedsrc:'',
    capnum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    stacap:'一',
    position:'',
    text:'',
    pagetitle: '懒游星球'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var fid = parseInt(options.fid);
    var sid = parseInt(options.sid);
    var pid = parseInt(options.pid);
    var stacap = this.data.capnum[sid];
    this.setData({
      fid:fid,
      sid:sid,
      stacap: stacap,
    })
    if (pid){
      this.setData({
        pid: pid,
      })
    }
    if (options.first) { //第一次编辑第一站
      this.setData({
        first: 1,
      })
    }
    if(options.exit){ //如果是修改
      this.setData({
        exit: 1
      })
      var that = this;
      var token = wx.getStorageSync('token');
      wx.request({ //
        url: "https://track.huiur.com/api/points/" + pid,
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
          var imgnames = res.data.images;
          var imgarr = []
          if (imgnames){
            for (let i = 0; i < imgnames.length; i++) {
              imgarr[i] = 'https://track.huiur.com' + imgnames[i]
            }
            that.setData({
              imgarr: imgarr,
              imgnames: imgnames,
            })
          }else{
            var vedsrc = 'https://track.huiur.com' + res.data.video.video;
            that.setData({
              vedsrc: vedsrc,
              vednames: res.data.video.video,
            })
          }
          that.setData({
            text: res.data.text,
            position: res.data.location,
          })
        }
      })
    }
  },
  addmedia:function(){ //添加图片或者视频
    var that = this;
    var imgarr = that.data.imgarr;
    if (imgarr.length==0){ //未添加媒体文件，询问添加照片还是视频
      wx.showActionSheet({
        itemList: ['照片', '视频'],
        success(res) {
          if (res.tapIndex == 0) { //选择照片
            wx.chooseImage({
              count: 6,
              sizeType: ['original', 'compressed'],
              sourceType: ['album'],
              success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                console.log(tempFilePaths);
                var ret = {
                  mode: 'photo',
                  sort: 'imgarr',
                  media: tempFilePaths,
                }
                console.log(ret);
                that.setData({
                  imgarr: tempFilePaths,
                })

                that.uploadfile(ret);
              }
            })
          } else if (res.tapIndex == 1) { //选择视频
            wx.chooseVideo({
              sourceType: ['album'],
              maxDuration: 60,
              camera: 'back',
              success(res) {
                console.log(res.tempFilePath)
                var ret = {
                  mode: 'video',
                  media: res.tempFilePath,
                }
                that.setData({
                 vedsrc: res.tempFilePath,
                })
               
                that.uploadfile(ret);
              }
            })
          }
        },
      })
    }else{ //已添加小于6张的图片，可以继续添加图片
      var imgarr = that.data.imgarr;
      var onum = 6 - that.data.imgarr.length
      wx.chooseImage({
        count: onum,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths);
          var ret = {
            mode: 'photo',
            sort: 'imgarr',
            media: tempFilePaths,
          }
          console.log(ret);
          var newimgarr = imgarr.concat(tempFilePaths);
          that.setData({
            imgarr: newimgarr,
          })
          

          that.uploadfile(ret);
        }
      })
    }
    
  },
  uploadfile: function (t) { //用户选择视频或者图片，上传至服务器 
    wx.showLoading({
      title: '正在上传中..',
    })
    console.log(t);
    var that = this;
    var mode = t.mode;
    if (mode == "video") { //视频
      that.uploadved(
        {
          vedsrc: t.media,
        }
      );
    } else if (mode == 'photo') { //图片
      var token = wx.getStorageSync('token');
      that.uploadimg({
        url: 'https://track.huiur.com/api/track',//这里是你图片上传的接口
        path: t.media,//这里是选取的图片的地址数组
        token: token,
        sort: t.sort,
        addupload: t.addupload
      });
      // that.uploadimg(t.media);
    }
  },
  uploadved: function (w) {
    wx.showLoading({
      title: '视频上传中..',
    })
    console.log(w);
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(w.vedsrc);
    wx.uploadFile({
      url: 'https://track.huiur.com/api/track',
      filePath: w.vedsrc,
      name: 'files',
      formData: {
        'token': token
      },
      success(res) {
        console.log(res);
        const data = res.data;
        if (res.statusCode == 200 || res.statusCode == 201) {
          wx.hideLoading();
          that.setData({
            vedsrc: w.vedsrc,
            vednames: data,
          })


        }else{
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '上传文件过大，请重新上传！',
          })
        }
        //do something
      }
    })
  },
  deleteved:function(){ //删除上传视频
    var that = this;
    wx.showActionSheet({
      itemList: ['删除视频'],
      success(res){
        if (res.tapIndex == 0) {
          that.setData({
            vedsrc:'',
            vednames:''
          })
        }
      }
    })
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
        if(resp.statusCode==200 || resp.statusCode==201){
          paths.push(resp.data);
        }else{
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '上传文件过大，请重新上传',
          })
        }
        

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
            var imgnames = that.data.imgnames;
            console.log(imgnames);
            if (imgnames) {
              var newpicname = imgnames.concat(paths);
            } else {
              var newpicname = paths
            }
            that.setData({
              imgnames: newpicname,
              paths: []
            })
           wx.hideLoading();
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
  bindKeyInput: function (e) {
    var that = this;
    that.setData({
      linkshow: true,
    });

    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'q1YUlD1fPN4E2vFjVA3gsCQ5f3VddlwS'
    });
    var fail = function (data) {
      console.log(data);
      if(data.statusCode==2){
        that.setData({
          linkshow: false,
        });
      }
    };
    var success = function (data) {
      var sugData = '';
      for (var i = 0; i < data.result.length; i++) {
        sugData = sugData + data.result[i].name + '\n';
      }
      console.log(data.result);
      that.setData({
        linkshow:true,
        sugData: data.result,

      });
    }
    // 发起suggestion检索请求 
    BMap.suggestion({
      query: e.detail.value,
      region: '北京',
      city_limit: false,
      fail: fail,
      success: success
    });
  },
  delspotimg:function(e){ //删除某张图片
    console.log(e);
    var nid = e.currentTarget.dataset.nid;
    var imgarr = this.data.imgarr;
    imgarr.splice(nid, 1);
    var imgnames = this.data.imgnames.splice(nid, 1);
    imgnames.splice(nid, 1);
    this.setData({
      imgarr: imgarr,
      imgnames: imgnames
    })
  },
  chooseplace: function (e) { //选择联想的地址
    var placename = e.currentTarget.dataset.place;
    var staid = e.currentTarget.dataset.sid;
    console.log(placename);
    this.setData({
      linkshow: false,
      position: placename,
    })
    var that = this;
    var token = wx.getStorageSync('token');
    // wx.request({ //
    //   url: "https://track.huiur.com/api/points/" + footarr[staid].pointsid,
    //   data: {
    //     location: placename,
    //     images: "",
    //     video: "",
    //   },
    //   method: 'PUT',
    //   header: {
    //     'content-type': 'application/json',
    //     'Authorization': 'Bearer ' + token,
    //   },
    //   success: function (res) {
    //     console.log(res);
    //   }
    // })
  },
  linkother:function(){
    this.setData({
      linkshow: false,
    })
  },
  placeblur: function (e) {
    console.log(e);
    var placename = e.detail.value;
    var token = wx.getStorageSync('token');
    var that = this;
    // wx.request({ //
    //   url: "https://track.huiur.com/api/points/" + footarr[staid].pointsid,
    //   data: {
    //     location: placename,
    //     images: "",
    //     video: "",
    //   },
    //   method: 'PUT',
    //   header: {
    //     'content-type': 'application/json',
    //     'Authorization': 'Bearer ' + token,
    //   },
    //   success: function (res) {
    //     console.log(res);
    //     that.setData({
    //       ['localfoot.footarr[' + staid + '].linkshow']: false,
    //       ['localfoot.footarr[' + staid + '].position']: placename,
    //     })
    //   }
    // })

  },
  formsubmit:function(e){
    console.log(e);
    var position = e.detail.value.position;
    var des = e.detail.value.des;
    var imgnames = this.data.imgnames;
    var vednames = this.data.vednames;
    var text = this.data.text;
    if (imgnames){
      if(imgnames.length==0){
        imgnames = "";
      }else{
        imgnames = imgnames;
      }
      
    }else{
      imgnames="";
    }
    if (vednames) {
      vednames = vednames;
    } else {
      vednames = "";
    }
    if (des) {
      console.log(des);
      des = des;
    } else {
      console.log(des);
      des = null;
    }
    var token = wx.getStorageSync('token');
    var that = this;
    if (position){
      if (imgnames || vednames) {
        if (des){
          if (that.data.sid == 0 && that.data.first) {
            var pointsid = that.data.pid;
            wx.request({ //
              url: "https://track.huiur.com/api/points/" + pointsid,
              data: {
                trackid: that.data.fid,
                images: imgnames,
                video: vednames,
                location: position,
                text: des
              },
              method: 'PUT',
              header: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
              },
              success: function (res) {
                console.log(res);
                if (res.statusCode == 201 || res.statusCode == 200) { //该站内容上传成功
                  console.log('上传成功');
                  wx.redirectTo({
                    url: '../makelist/makelist?id=' + that.data.fid,
                  })
                }
              }
            })
          } else {
            if (that.data.exit) {
              var pointsid = that.data.pid;
              wx.request({ //
                url: "https://track.huiur.com/api/points/" + pointsid,
                data: {
                  trackid: that.data.fid,
                  images: imgnames,
                  video: vednames,
                  location: position,
                  text: des
                },
                method: 'PUT',
                header: {
                  'content-type': 'application/json',
                  'Authorization': 'Bearer ' + token,
                },
                success: function (ores) {
                  console.log(ores);
                  if (ores.statusCode == 201 || ores.statusCode == 200) { //该站内容上传成功
                    console.log('上传成功')
                    wx.redirectTo({
                      url: '../makelist/makelist?id=' + that.data.fid,
                    })
                  }
                }
              })
            } else {
              wx.request({ //
                url: "https://track.huiur.com/api/points/create",
                data: {
                  trackid: that.data.fid,
                  images: imgnames,
                  video: vednames,
                  location: position,
                  text: des
                },
                method: 'GET',
                header: {
                  'content-type': 'application/json',
                  'Authorization': 'Bearer ' + token,
                },
                success: function (ores) {
                  console.log(ores);
                  if (ores.statusCode == 201 || ores.statusCode == 200) { //该站内容上传成功
                    console.log('上传成功')
                    wx.redirectTo({
                      url: '../makelist/makelist?id=' + that.data.fid,
                    })
                  }
                }
              })
            }

          }
        }else{
          wx.showModal({
            title: '提示',
            content: '请写一写当时的心情吧(´･Д･)」输入更多的描述文字，可获得更多的推荐度哦！',
          })
        }
        

      } else {
        wx.showModal({
          title: '提示',
          content: '请上传图片或视频哦',
        })
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入站点名称(｡ì _ í｡)',
      })
    }
    
    
    
  },
  suggesttap:function(){
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



})