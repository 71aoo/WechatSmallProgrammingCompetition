var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '5LYBZ-QC53D-NAA4G-HJN4A-V26MZ-OEB7H'//申请的开发者秘钥key
});

Page
({
  data: 
  {
    map_height:795,
    longitude: 103.92377,
    latitude:30.57447,
    scroll_height:405,
    markers:
    [{
      // id:0,
      // iconPath:"../images/sign.png",
      // latitude: 30.57447,
      // longtitude: 103.92377,
      // width: 50,
      // height: 50,
      // title:"123",
      // address:"123",
      // dis:"123",
      // stars:[]
    }],
    shopGrade:0,
    shopGrade1: 4.6,
    averge:[{
      id:1,
      score:0
    }],
    id:0 //index下标    
  }
  //show current position
  , onLoad: function (_res) 
  {
      var that = this;
      //获得当前位置
      wx.getLocation  
      ({         
          success: function (dis)
         {    
           var mar = [];
           console.log(that)

           mar.push
           ({
            latitude: dis.latitude,
            longitude: dis.longitude,
            iconPath:"../../sign.png",  //自己位置图片

           })
            that.setData
            ({
              markers:mar
            })   

          }
      })
  
      wx.getLocation  //获得当前位置
      ({         
          success: function (dis)
         {    
              that.setData
                ({
                  longitude: dis.longitude,
                  latitude: dis.latitude
                })      
              // console.log(res)
              qqmapsdk.search  //调用腾讯地图api以当前位置为中心搜索厕所
              ({
                  keyword:'厕所',
                  longitude:dis.longitude,
                  latitude:dis.latitude,
                  success:function(res)
                  { 
                    var mar = [];
                    var sum = 0; 
                    for(var i = 0 ; i < res.data.length; i++)
                    {
                      //查询每一个厕所在数据库里的位置
                      wx.cloud.init
                      ({
                        env: 'wc-score',
                      });
                      const db = wx.cloud.database();
                    
                      db.collection('city').where
                      ({
                        wc_id:res.data[i].id
                      })
                      .get
                        ({
                          success(dds) 
                          {  
                             var mar=[];
                             var index = that.data.id
                             // dist 当前位置距离厕所的距离     
                             var dist = that.getDistance(dis.latitude,dis.longitude,res.data[index].location.lat,res.data[index].location.lng);              
                             var sum = 0   //评分平均分         
                              if(dds.data.length != 0)
                              {               
                                for (var j = 0; j < dds.data.length; j++) 
                                {                                   
                                  sum += Number(dds.data[j].score)    
                                }                
                                sum = sum / Number(dds.data.length)                                                             
                              }
                              //  console.log(sum) 
                              mar.push
                              ({                                                                
                                  title: res.data[index].title,
                                  id: res.data[index].id,
                                  latitude: res.data[index].location.lat,
                                  longitude: res.data[index].location.lng,
                                  iconPath:"../images/locat.png",
                                  width:20,
                                  height:20,
                                  address:res.data[index].address,
                                  distance: dist.toFixed(2) * 1000,
                                  stars:that.starCount(sum)                                                                    
                                })                                
                                that.setData
                                ({
                                  markers:that.data.markers.concat(mar),
                                  id:that.data.id + 1                            
                                })                                                                                                                                                                                       
                          } 
                        })
                    }                                                                                                    
                  },
                  fail:function(_res)
                  {
                    console.log('地图错误，或请授权获取位置')
                  }                                                       
              })                                       
          }
        })                        
  },
  //计算当前位置到目的地距离
  getDistance:function(lat1, lng1, lat2, lng2) 
    {
      // console.log(lat1, lng1, lat2, lng2)
      var radLat1 = lat1 * Math.PI / 180.0;
      var radLat2 = lat2 * Math.PI / 180.0;
      var a = radLat1 - radLat2;
      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;
      s = Math.round(s * 10000) / 10000;
      return s;
    },
    computeGrade(e) {
      let score = e.detail.score;
      this.setData({
        shopGrade: score
      })
    },
    //得到用户提交分数
    submit: function (_res)  
    {
      var that = this
      var curr_socre = Number(this.data.shopGrade) //用户评分值
      // console.log(this.data.shopGrade)
      wx.cloud.init
      ({
        env: 'wc-score',        
      });
      const db = wx.cloud.database();
      db.collection('city').add
      ({
        
        // data 传入需要局部更新的数据
        data: 
        {
          score: this.data.shopGrade,
          wc_id: this.data.id
        },
        success(e) 
        {
          // console.log(that)
          
          
        }
      })
      
      this.hideModal();
      this.showdata();
      
    }, 
    //点击我显示底部弹出框
    clickme: function (a) {
      // console.log(a.target.id);
      this.showModal();
      this.setData({
        id:String(a.target.id)
      })
        
    },
    //显示对话框
    showModal: function () {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },
    //隐藏对话框
    hideModal: function () {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)
    }, 
    starCount: function (originStars) 
    {
      //计算星星显示需要的数据，用数组stars存储五个值，分别对应每个位置的星星是全星、半星还是空星
      var starNum = originStars * 10 / 10, stars = [], i = 0;
      do {
        if (starNum >= 1) {
          stars[i] = 'full';
        } else if (starNum >= 0.5) {
          stars[i] = 'half';
        } else {
          stars[i] = 'no';
        }
        starNum--;
        i++;
      } while (i < 5)
      return stars;
    },
    //导航
    findRoad:function(e)
    {
      // console.log('1',e.currentTarget.dataset.id)
      // console.log('2',e.target.dataset.id)
      var that = this
      wx.navigateTo({
        url: '/pages/road/road?longitude='+ e.currentTarget.dataset.id.longitude +'&latitude='+ e.currentTarget.dataset.id.latitude + '&title=' + e.currentTarget.dataset.id.title 
      })
    
    }
 
})