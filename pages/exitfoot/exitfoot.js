// pages/exitfoot/exitfoot.js
var bmap = require('../../utils/bmap-wx.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    capnum:['一','二','三','四','五','六','七','八','九','十'],
    coverdefsrc:'https://track.huiur.com/images/coverimg.png',
    coverimg:'https://track.huiur.com/images/coverimg.png',
    coverdef:true,
    localfoot:{
      top: {
        name: '',
        // cover: undefined,
      },
      firstshow:true,
      footarr: [
        {
          staid: 0,
          position: '',
        }
      ],
    },
    name_fill:false,
    sugData: '',
    paths:[],
    codeshow:false,
    pagetitle:'制作足迹'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '制作足迹',
    })
    var that = this;
    var token = wx.getStorageSync('token');
    var localfoot = that.data.localfoot;

    
  },
  uploadcover:function(){ //上传封面图
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
          mask:true,
        })
        const cover = res.tempFilePaths[0];
        var coverarr = [];
        coverarr.push(cover);
        console.log(coverarr);
        that.setData({
          coverimg: cover,
          'localfoot.top.cover': cover,
          coverdef:false
        })
        var ret = {
          mode: 'photo',
          sort:'cover',
          media: coverarr
        }
        console.log(ret);
        var covername = that.uploadfile(ret);
      }
    })
  },
  delcover:function(){
    var that = this;
    that.setData({
      coverimg: that.data.coverdefsrc,
      coverdef: true
    })
  },
  nameblur:function(e){ //输入足迹名称失去焦点
    var value = e.detail.value;
    var that = this;
    console.log(value);
    var token = wx.getStorageSync('token');
    var banner = this.data.localfoot.top.covername ? this.data.localfoot.top.covername :'/images/default.png';
    var footid = that.data.footid;
    if(value!=''){ 
      if (that.data.footid) { //修改足迹 
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

            that.setData({
              'localfoot.top.name': value,
              name_fill: true,
            })
          }
        })
      } else { //创建足迹 creat
        console.log('输入足迹标题');
        wx.request({ //
          url: "https://track.huiur.com/api/track/create",
          data: {
            title: value,
            banner: banner,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          success: function (res) {
            console.log(res);
            //返回第一站的站点id
            that.setData({
              'localfoot.top.name': value,
              name_fill: true,
              footid: res.data.id,
              pointsid: res.data.pointsid,
              // ['localfoot.footarr[' + 0 + '].pointsid']: res.data.pointsid,
            })
          }
        })
      }
      
      
    }else{
      that.setData({
        'localfoot.top.name': value,
         name_fill: false,
      })
      console.log('未输入标题');
    }
  },
  posfocus:function(e){ //位置获取焦点
    console.log(e);
    var sid = e.currentTarget.dataset.sid;
    if(sid==0){
      //第一站输入位置，判断足迹名称是否为空/
      if(this.data.name_fill){
        this.setData({
          upshow01: false
        })
      }else{ //为空
        this.setData({
          upshow01:true
        })
        wx.showModal({
          title: '提示',
          content: '请先填写足迹名称 :)',
          confirmColor:'#fed641',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  },
  bindKeyInput: function (e) {
    var footarr = this.data.localfoot.footarr;
    var sid = e.currentTarget.dataset.sid;
    var that = this;
    that.setData({
      ['localfoot.footarr[' + sid + '].linkshow']: true,
    });
    
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'q1YUlD1fPN4E2vFjVA3gsCQ5f3VddlwS'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var sugData = '';
      for (var i = 0; i < data.result.length; i++) {
        sugData = sugData + data.result[i].name + '\n';
      }
      console.log(data.result);
      footarr[sid].linkshow=true;
      that.setData({
        // ['localfoot.footarr[' + sid + '].linkshow']: true,
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
  chooseplace:function(e){ //选择联想的地址
    var placename = e.currentTarget.dataset.place;
    var staid = e.currentTarget.dataset.sid;
    console.log(placename);
    this.setData({
      ['localfoot.footarr[' + staid + '].linkshow']: false,
      ['localfoot.footarr['+ staid +'].position']: placename,
    })
    var that = this;
    var token = wx.getStorageSync('token');
    var footarr = this.data.localfoot.footarr;
    wx.request({ //
      url: "https://track.huiur.com/api/points/" + footarr[staid].pointsid,
      data: {
        location: placename,
        images: "",
        video: "",
      },
      method: 'PUT',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
      }
    })
  },
  placeblur:function(e){
    console.log(e);
    var placename = e.detail.value;
    var staid = e.currentTarget.dataset.sid;
    var footarr = this.data.localfoot.footarr;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({ //
      url: "https://track.huiur.com/api/points/" + footarr[staid].pointsid,
      data: {
        location: placename,
        images: "",
        video: "",
      },
      method: 'PUT',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        that.setData({
          ['localfoot.footarr[' + staid + '].linkshow']: false,
          ['localfoot.footarr[' + staid + '].position']: placename,
        })
      }
    })
    
  },
  suggesttap:function(){
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  firstadd:function(){ //第一次添加内容
    var footarr = this.data.localfoot.footarr;
    if (footarr[0].position==''){ //地址为空
      this.setData({
        ['localfoot.footarr[' + 0 + '].warnfill']: true,
      })
    }else{
      this.setData({
        ['localfoot.footarr[' + 0 + '].warnfill']: false,
      })
      var spotid = 0;
      this.actionsheet(spotid);
    }
    
  },
  nextadd:function(){//添加下一站,上传上一站的所有内容，并显示下一站的地址输入框
    
    var footarr = this.data.localfoot.footarr;
    var k = footarr.length-1;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({ //
      url: "https://track.huiur.com/api/points/create",
      data: {
        trackid: that.data.footid,
        images: '',
        video: ''
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (ores) {
        console.log(ores);
        // footarr[k].upload = true;
        footarr.push(
          {
            staid: k + 1,
            position: '',
          }
        )
        footarr[k + 1].pointsid = ores.data.id;

        that.setData({
          'localfoot.footarr': footarr
        })
      }
    })
    // if (footarr[k].imgarr || footarr[k].vedsrc){ //上传上一站所有内容
    //   console.log(footarr[k]);
    //   var text = footarr[k].text;
    //   console.log(text);
    //   if(text==undefined){
    //     text=""
    //   }
    //   var imgnames = footarr[k].imgnames ? footarr[k].imgnames:'';
    //   var vednames = footarr[k].vednames ? footarr[k].vednames : '';
    //   if(k==0){ //第一站上传使用修改站点接口
    //     wx.request({ //
    //       url: "https://track.huiur.com/api/points/" + footarr[0].pointsid,
    //       data: {
    //         location: footarr[k].position,
    //         text: text,
    //         images: imgnames,
    //         video: vednames,
    //       },
    //       method: 'PUT',
    //       header: {
    //         'content-type': 'application/json',
    //         'Authorization': 'Bearer ' + token,
    //       },
    //       success: function (res) {
    //         console.log(res);
    //         footarr[k].upload = true;
    //         // footarr.push(
    //         //   {
    //         //     staid: k + 1,
    //         //     position: '',
    //         //   }
    //         // )
    //         that.setData({
    //           'localfoot.footarr': footarr
    //         })
            
    //       }
    //     })
    //   }else{ //第一站以后使用上传站点接口
        
    //     // wx.request({ //
    //     //   url: "https://track.huiur.com/api/points/create",
    //     //   data: {
    //     //     trackid: that.data.footid,
    //     //     location: footarr[k].position,
    //     //     text: text,
    //     //     images: imgnames,
    //     //     video: vednames,
    //     //   },
    //     //   method: 'GET',
    //     //   header: {
    //     //     'content-type': 'application/json',
    //     //     'Authorization': 'Bearer ' + token,
    //     //   },
    //     //   success: function (res) {
    //     //     console.log(res);
    //     //     footarr[k].upload = true;
    //     //     footarr[k].pointsid=res.data.id;
    //     //     footarr.push(
    //     //       {
    //     //         staid: k + 1,
    //     //         position: '',
    //     //       }
    //     //     )
    //     //     that.setData({
    //     //       'localfoot.footarr': footarr
    //     //     })
    //     //   }
    //     // })
    //   }
      
    // }else{ //添加本站media
    //   if (footarr[k].position == '') { //地址为空
    //     this.setData({
    //       ['localfoot.footarr[' + k + '].warnfill']: true,
    //     })
    //   } else {
    //     this.setData({
    //       ['localfoot.footarr[' + k + '].warnfill']: false,
    //     })
    //     var spotid = k;
    //     this.actionsheet(spotid);
    //   }
    // }
    
    
    
  },
  actionsheet:function(p){
    var that = this;
    var sid = p;
    wx.showActionSheet({
      itemList: ['图片', '视频'],
      success(res) {
        if (res.tapIndex==0){ //用户选择图片
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
                sid:p
              }
              console.log(ret);
              that.setData({
                ['localfoot.footarr[' + sid + '].imgarr']: tempFilePaths,
              })
              if(sid==0){
                that.setData({
                  'localfoot.firstshow':false,
                })
              }
              that.uploadfile(ret);
            }
          })
        } else if (res.tapIndex == 1){ //用户选择视频
          wx.chooseVideo({
            sourceType: ['album'],
            maxDuration: 60,
            camera: 'back',
            success(res) {
              console.log(res.tempFilePath)
              var ret = {
                mode:'video',
                media: res.tempFilePath,
                sid: sid
              }
              that.setData({
                ['localfoot.footarr[' + sid + '].vedsrc']: res.tempFilePath,
              })
              if (sid == 0) {
                that.setData({
                  'localfoot.firstshow': false,
                })
              }
              that.uploadfile(ret);
            }
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    }) 
  },
  spotmenu:function(e){
    console.log(e);
    var sid = e.currentTarget.dataset.sid;
    var footarr = this.data.localfoot.footarr;
    var that = this;
    var token = wx.getStorageSync('token');
    if(footarr.length>sid+2){ //有插入
      wx.showActionSheet({
        itemList: ['删除', '插入'],//, '插入'
        success(res) {
          if (res.tapIndex == 0) { //删除本站
            // if(footarr[sid].upload){ //已经上传
            var pointsid = footarr[sid].pointsid;
            var footid = that.data.footid;
              if(sid==0){ //第一站
                
                wx.request({ //
                  url: "https://track.huiur.com/api/points/" + pointsid,
                  data: {
                    trackid:footid
                  },
                  method: 'DELETE',
                  header: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                  },
                  success: function (res) {
                    console.log(res);
                    that.resetfoot();
                  }
                })
                var fir = {
                  staid: 0,
                  position: '',
                  pointsid: footarr[0].pointsid
                }
                footarr.splice(0, 1);
                console.log(footarr);
                that.setData({
                  'localfoot.footarr': footarr
                })

              }else{ //不是第一站
                wx.request({ //
                  url: "https://track.huiur.com/api/points/" + pointsid,
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
                    that.resetfoot();
                  }
                })
                footarr.splice(sid, 1);
                console.log(footarr);
                that.setData({
                  'localfoot.footarr': footarr
                })
              }
            // }else{ //未上传
            //   if (sid == 0) { //第一站
            //     var fir = {
            //       staid: 0,
            //       position: '',
            //       pointsid: footarr[0].pointsid
            //     }
            //     footarr.splice(0, 1,fir);
            //     console.log(footarr);
            //     that.setData({
            //       'localfoot.footarr':footarr
            //     })

            //   } else { //不是第一站
            //     footarr.splice(sid, 1);
            //     console.log(footarr);
            //     that.setData({
            //       'localfoot.footarr': footarr
            //     })
            //   }
            // }
          } else if (res.tapIndex == 1) { //在本站后插入新站
            var pointsid = footarr[sid].pointsid;
            var footid = that.data.footid;
            
            wx.request({ //
              url: "https://track.huiur.com/api/points",
              data: {
                trackid: footid,
                pointsid: pointsid,

              },
              method: 'POST',
              header: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
              },
              success: function (res) {
                console.log(res);
                var insert = {
                  staid: sid + 1,
                  position: '',
                  pointsid:res.data.id,
                  insert:true,
                }
                footarr.splice(sid + 1, 0, insert);
                that.setData({
                  'local.footarr': footarr
                })
                that.resetfoot();
              }
            })
            
          }
        }
      })
    }else{ //无插入
      wx.showActionSheet({
        itemList: ['删除'],
        success(res) {
          if (res.tapIndex == 0) { //删除本站
            var pointsid = footarr[sid].pointsid;
            var footid = that.data.footid;
            wx.request({ //
              url: "https://track.huiur.com/api/points/" + pointsid,
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
              }
            })
            // if (footarr[sid].upload) { //已经上传
              if (sid == 0) { //第一站
                var pointsid = footarr[sid].pointsid;
                var footid = that.data.footid;
                // wx.request({ //
                //   url: "https://track.huiur.com/api/points/" + pointsid,
                //   data: {
                //     trackid: footid
                //   },
                //   method: 'DELETE',
                //   header: {
                //     'content-type': 'application/json',
                //     'Authorization': 'Bearer ' + token,
                //   },
                //   success: function (res) {
                //     console.log(res);
                //   }
                // })
                var fir = {
                  staid: 0,
                  position: '',
                  pointsid: footarr[0].pointsid
                }
                footarr.splice(0, 1,fir);
                console.log(footarr);
                that.setData({
                  'localfoot.footarr': footarr
                })

              } else { //不是第一站
                footarr.splice(sid, 1);
                console.log(footarr);
                that.setData({
                  'localfoot.footarr': footarr
                })
              }
  
              if (sid == 0) { //第一站
                var fir = {
                  staid: 0,
                  position: '',
                  pointsid: footarr[0].pointsid
                }
                footarr.splice(0, 1, fir);
                console.log(footarr);
                that.setData({
                  'localfoot.footarr': footarr
                })

              } else { //不是第一站
                footarr.splice(sid, 1);
                console.log(footarr);

                that.setData({
                  'localfoot.footarr': footarr
                })
              }
            
          } 
        }
      })
    }
    
  },
  jumpstation:function(){ //新建站点页面
    if (this.data.name_fill) {
      var footid = this.data.footid;
      var pid = this.data.pointsid;
      wx.navigateTo({
        url: '../newstation/newstation?fid=' + footid + '&sid=' + 0 + '&pid=' + pid +'&first=' + 1,
      })
    }else{ //标题为空
      wx.showModal({
        title: '提示',
        content: '请先填写足迹名称 :)',
        confirmColor: '#fed641',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
  },
  previewimgs: function (e) {
    var now =  e.currentTarget.dataset.img;
    var arr = e.currentTarget.dataset.arr;
    wx.previewImage({
      current: now, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  resetfoot:function(){ //为footarr重置id
    var footarr = this.data.localfoot.footarr;
    console.log(footarr);
    for(let i=0;i<footarr.length;i++){
      footarr[i].staid=i
    }
    this.setData({
      'localfoot.footarr':footarr
    })
  },
  textblur:function(e){ //输入站点描述文字
    var text = e.detail.value;
    var sid = e.currentTarget.dataset.sid;
    this.setData({
      ['localfoot.footarr[' + sid + '].text']: text,
    })
    var that = this;
    var token = wx.getStorageSync('token');
    var footarr = that.data.localfoot.footarr;

    wx.request({ //
      url: "https://track.huiur.com/api/points/" + footarr[sid].pointsid,
      data: {
        text: text,
      },
      method: 'PUT',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
      }
    })
  },
  completetap:function(){ //完成制作
    var that = this;
    var token = wx.getStorageSync('token');
    var footid = that.data.footid;
    var footarr = that.data.localfoot.footarr;
    var lastmedia = footarr[footarr.length-1];
    wx.request({ //
      url: "https://track.huiur.com/api/tFinish/" + footid,
      data: {

      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == '0') {
          that.setData({
            codeshow: true
          })
          setTimeout(
            function aa() {
              wx.switchTab({
                url: '../index/index',
              })
            },2000
          )
          
        }
      }
    })
    // if (lastmedia.upload==true){ 
    //   wx.request({ //
    //     url: "https://track.huiur.com/api/tFinish/" + footid,
    //     data: {

    //     },
    //     method: 'GET',
    //     header: {
    //       'content-type': 'application/json',
    //       'Authorization': 'Bearer ' + token,
    //     },
    //     success: function (res) {
    //       console.log(res);
    //       if (res.data.code == '0') {
    //         wx.redirectTo({
    //           url: '../index/index',
    //         })
    //       }
    //     }
    //   })
    // } else if (lastmedia.imgarr || lastmedia.vedsrc){
    //   console.log('需要先上传本站内容')
    //   var footarr = this.data.localfoot.footarr;
    //   var k = footarr.length - 1;
    //   var text = footarr[k].text;
    //   console.log(text);
    //   if (text == undefined) {
    //     text = ""
    //   }
    //   var imgnames = footarr[k].imgnames ? footarr[k].imgnames : '';
    //   var vednames = footarr[k].vednames ? footarr[k].vednames : '';
    //   wx.request({ //
    //     url: "https://track.huiur.com/api/points/create",
    //     data: {
    //       trackid: that.data.footid,
    //       location: footarr[k].position,
    //       text: text,
    //       images: imgnames,
    //       video: vednames,
    //     },
    //     method: 'GET',
    //     header: {
    //       'content-type': 'application/json',
    //       'Authorization': 'Bearer ' + token,
    //     },
    //     success: function (res) {
    //       console.log(res);
    //       footarr[k].upload = true;
    //       footarr[k].pointsid = res.data.id;
    //       footarr.push(
    //         {
    //           staid: k + 1,
    //           position: '',
    //         }
    //       )
    //       that.setData({
    //         'localfoot.footarr': footarr
    //       })
    //       wx.request({ //
    //         url: "https://track.huiur.com/api/tFinish/" + footid,
    //         data: {

    //         },
    //         method: 'GET',
    //         header: {
    //           'content-type': 'application/json',
    //           'Authorization': 'Bearer ' + token,
    //         },
    //         success: function (ores) {
    //           console.log(ores);
    //           if (ores.data.code == '0') {
    //             wx.navigateTo({
    //               url: '../index/index',
    //             })
    //           }
    //         }
    //       })
    //     }
    //   })
      
    // }else{ //暂定此情况为添加的下一站为空（未上传媒体文件）请求提交制作接口
    //   console.log('最后一站为空');
    //   wx.request({ //
    //     url: "https://track.huiur.com/api/tFinish/" + footid,
    //     data: {

    //     },
    //     method: 'GET',
    //     header: {
    //       'content-type': 'application/json',
    //       'Authorization': 'Bearer ' + token,
    //     },
    //     success: function (res) {
    //       console.log(res);
    //       if (res.data.code == '0') {
    //         wx.navigateTo({
    //           url: '../index/index',
    //         })
    //       }
    //     }
    //   })
    // }
    
  },
  codeclosebtn: function () { //积分弹窗
    this.setData({
      codeshow: false
    })
  },
  uploadfile:function(t){ //用户选择视频或者图片，上传至服务器 
    console.log(t);
    var that = this;
    var mode = t.mode;
    if(mode == "video"){ //视频
      that.uploadved(
        {
          vedsrc: t.media,
          sid:t.sid
        }
        );
    }else if(mode == 'photo'){ //图片
      var token = wx.getStorageSync('token');
      that.uploadimg({
        url: 'https://track.huiur.com/api/track',//这里是你图片上传的接口
        path: t.media,//这里是选取的图片的地址数组
        token: token,
        sort: t.sort,
        sid:t.sid,
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
    var sid = w.sid;
    var footarr = that.data.localfoot.footarr;
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
        if (data) {
          wx.hideLoading();
          wx.request({ //
            url: "https://track.huiur.com/api/points/" + footarr[sid].pointsid,
            data: {
              images: "",
              video: data,
            },
            method: 'PUT',
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            success: function (ires) {
              console.log(ires);

              that.setData({
                ['localfoot.footarr[' + sid + '].vedsrc']: w.vedsrc,
                ['localfoot.footarr[' + sid + '].vednames']: data,
              })
            }
          })
          
         
        }
        //do something
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
          if(data.sort=='cover'){ //上传的是封面图
            that.coverupload(paths);
          }else{ //上传的是足迹图片
            var token = wx.getStorageSync('token');
            var footarr = that.data.localfoot.footarr;
            console.log(that.data.localfoot.footarr[data.sid].imgnames)
            if (that.data.localfoot.footarr[data.sid].imgnames){
              var newpicname = that.data.localfoot.footarr[data.sid].imgnames.concat(paths);
            }else{
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
  coverupload:function(ev){ //上传的封面图判断
    var imgname = ev;
    console.log(imgname);
    var that = this;
    var token = wx.getStorageSync('token');
    if(this.data.footid){ //存在footid,使用修改接口
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
    }else{ //不存在footid，将封面图信息存到data里
      this.setData({
        'localfoot.top.covername': imgname[0],
      })
      wx.hideLoading();
    }

  },
  delspotimg:function(e){ //删除站点图片
    console.log(e);
    var nid = e.currentTarget.dataset.nid;//第几张图片
    var sid = e.currentTarget.dataset.sid;//第几站
    var footarr = this.data.localfoot.footarr;
    var that = this;
    var token = wx.getStorageSync('token');
    if(footarr[sid].upload){ //已经上传本站内容，需要请求站点修改接口
      footarr[sid].imgarr.splice(nid,1);
      footarr[sid].imgnames.splice(nid, 1);
      that.setData({
        'localfoot.footarr':footarr
      })
      var point = footarr[sid].pointsid
      wx.request({ //
        url: "https://track.huiur.com/api/points/" + point,
        data: {
          images: footarr[sid].imgnames,
        
        },
        method: 'PUT',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);

        }
      })
    }else{ //未上传本站内容
      footarr[sid].imgarr.splice(nid, 1);
      footarr[sid].imgnames.splice(nid, 1);
      that.setData({
        'localfoot.footarr': footarr
      })
      var point = footarr[sid].pointsid;
      wx.request({ //
        url: "https://track.huiur.com/api/points/" + point,
        data: {
          images: footarr[sid].imgnames,
      
        },
        method: 'PUT',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);

        }
      })
    }
  },
  addothers:function(e){ //点击加号按钮
    var that = this;
    var sid = e.currentTarget.dataset.sid;
    var footarr = this.data.localfoot.footarr;
    var imgarr = footarr[sid].imgarr;
    var vedsrc = footarr[sid].vedsrc;
    var onum = 6-imgarr.length; //还可以最多传几张照片
    if(imgarr.length==0){ //可以传视频和图片
      wx.showActionSheet({
        itemList: ['图片', '视频'],
        success(res) {
          if (res.tapIndex == 0) { //用户选择图片
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
                  sid: sid,
                  addupload:true
                }
                console.log(ret);
                var newimgarr = imgarr.concat(tempFilePaths);
                that.setData({
                  ['localfoot.footarr[' + sid + '].imgarr']: newimgarr,
                })
                if (sid == 0) {
                  that.setData({
                    'localfoot.firstshow': false,
                  })
                }
                that.uploadfile(ret);
              }
            })
          } else if (res.tapIndex == 1) { //用户选择视频
            wx.chooseVideo({
              sourceType: ['album'],
              maxDuration: 60,
              camera: 'back',
              success(res) {
                console.log(res.tempFilePath)
                var ret = {
                  mode: 'video',
                  media: res.tempFilePath,
                  sid:sid,
                }
                that.uploadfile(ret);
              }
            })
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      }) 
    }else{ //只能继续传图片
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
            sid: sid,
            addupload: true
          }
          console.log(ret);
          var newimgarr = imgarr.concat(tempFilePaths);
          that.setData({
            ['localfoot.footarr[' + sid + '].imgarr']: newimgarr,
          })
          if (sid == 0) {
            that.setData({
              'localfoot.firstshow': false,
            })
          }
          that.uploadfile(ret);
        }
      })
    }
  },
  addall:function(e){
    console.log(e);
    var k = e.currentTarget.dataset.sid;
    var footarr = this.data.localfoot.footarr;
    if (footarr[k].position == '') { //地址为空
      console.log('fffff');
      this.setData({
        ['localfoot.footarr[' + k + '].warnfill']: true,
      })
    } else {
      console.log('fsdfdsf');
      this.setData({
        ['localfoot.footarr[' + k + '].warnfill']: false,
      })
      var spotid = k;
      this.actionsheet(spotid);
    }
    
  },
  changespot:function(e){ //修改站点内容
    console.log(e);
    var mode = e.mode;
    var sid = e.sid;
    var that = this;
    var footarr = this.data.localfoot.footarr;
    var token = wx.getStorageSync('token');
    if (mode=='images'){
      var point = footarr[sid].pointsid
      wx.request({ 
        url: "https://track.huiur.com/api/points/" + point,
        data: {
          images: footarr[sid].imgnames,
    
        },
        method: 'PUT',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);

        }
      })
    }
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
    wx.request({ //
      url: "https://track.huiur.com/api/count",
      data: {
        pages: '开始制作',
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