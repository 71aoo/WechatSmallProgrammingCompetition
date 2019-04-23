var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '5LYBZ-QC53D-NAA4G-HJN4A-V26MZ-OEB7H'//申请的开发者秘钥key
});
var app = getApp();
const daa = 0;

Page
({
  data: 
  {
    stars: [],
    map_height:900,
    longitude: 103.92377,
    latitude:30.57447,
    scroll_height:300,
    markers:
    [{
      id:0,
      iconPath:"../images/sign.png",
      latitude: 30.57447,
      longtitude: 103.92377,
      width: 50,
      height: 50,
      title:"123",
      address:"123",
      dis:"123",
      stars:[]
 
    }],
    shopGrade:0,
    shopGrade1: 4.6,
    averge:[{
      id:1,
      score:0
    }],
    id:"", //每次点击弹窗时地址的id，地址id来自地图自带
    one:0 
    
  }
  //show current position
  , onLoad: function (_res) 
  {
      var that = this;
      this.showStar(1); //传入星星参数
  
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
                    that.checkDatabases(res)                 
                    for(var i = 0 ; i < res.data.length; i++)
                    {
                      
                      var dist = that.getDistance(dis.latitude,dis.longitude,res.data[i].location.lat,res.data[i].location.lng);                     
                      
                      
                    
                      
                      
                      mar.push
                      ({
                        
                        
                          title: res.data[i].title,
                          id: res.data[i].id,
                          latitude: res.data[i].location.lat,
                          longitude: res.data[i].location.lng,
                          iconPath:"../images/locat.png",
                          width:20,
                          height:20,
                          address:res.data[i].address,
                          distance: dist.toFixed(2) * 1000,
                          
                          
                        }),
                        that.setData
                        ({
                          markers:mar
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
  getDistance:function(lat1, lng1, lat2, lng2) //计算当前位置到目的地距离
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
    /* 先查询数据是否有记录到这个wc的评分
       如果有就计算评分平均分，并添加最新评分
       没有就重新创建到数据库 
    */
    submit: function (_res)  //提交分数
    {
      var that = this
      var curr_socre = Number(this.data.shopGrade) //用户评分值
      // console.log(this.data.shopGrade)
      wx.cloud.init
      ({
        env: 'wc-score',
        

      });
      const db = wx.cloud.database();
      db.collection('city').where
      ({
          wc_id:this.data.id
      })
        .get
        ({
          success(ds) 
          {
            
            var sum = 0; //总分
            
            console.log(ds)
            for (var i = 0; i < ds.data.length; i++) 
            {
              // console.log(ds.data[i].score)
              sum += Number(ds.data[i].score)

            }
            sum += curr_socre
            sum = sum / (ds.data.length + 1)
            // console.log(sum)

            // that.setData({
            //   averge: Number(sum)
            // })                                     
          }
                                   
        })
        db.collection('city').add
        ({
          // data 传入需要局部更新的数据
          data: 
          {
            score: this.data.shopGrade,
            wc_id: this.data.id
          },
          success(_e) 
          {
            // console.log(e)
            
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
    showdata:function()
    {
      // console.log(this.data.num)
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
    showStar: function (num)
    {
      var that = this;
      var renderData = {
        stars: that.starCount(num)
      };
      that.setData(renderData)

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
    // checkDatabases:function(addId)
    // {
    //   var that = this
    //   var searchId = String(addId)
      
      
    //   wx.cloud.init
    //   ({
    //     env: 'wc-score',
        

    //   });
    //   const db = wx.cloud.database();
      
    //   db.collection('city').where
    //   ({
    //       wc_id:searchId
    //   })
    //     .get
    //     ({
    //       success(dds) 
    //       {
            
    //         var sum = 0;//总分
            
    //         if(dds.data.length != 0)
    //         {
              
    //           for (var i = 0; i < dds.data.length; i++) 
    //           {
                
    //             // console.log(ds.data[i].score)
    //             sum += Number(dds.data[i].score)
  
    //           }
              
    //           sum = sum / Number(dds.data.length)
              

    //         } 
            
    //         that.setData
    //           ({
    //             averge :  Number(sum)
    //           })
            
           
            
                           
            

    //       }
          
    //     })
        
        
    //     // return that.data.averge
    // }
    checkDatabases:function(res)
    {
      var that = this;
      
      var a =  new Promise(function (resolve, reject)
      {
        
        
        
        
        for(var i = 0 ; i < res.data.length; i++)
        {
          
          wx.cloud.init
          ({
          env: 'wc-score',
          

          });
          const db = wx.cloud.database();
          // console.log(res.data[i].id)
          db.collection('city').where
          ({
            wc_id:res.data[i].id
          })
          .get
          ({
            success(dds) 
            {
               
              var sum = 0;//总分
              // var bb = [];
              // console.log(dds)
              if(dds.data.length != 0)
              {
               
                for (var j = 0; j < dds.data.length; j++) 
                {
                  
                  // console.log(ds.data[i].score)
                  sum += Number(dds.data[j].score)
    
                }
                
                sum = sum / Number(dds.data.length)                                                             
              }
              
              var renderData = 
              {
                stars: that.starCount(num)
              };       
              that.setData
              ({
                renderData
              })  
              
              
            }
            
          })


        }
        
              // mar.push
              // ({
                
                
              //     title: res.data[i].title,
              //     id: res.data[i].id,
              //     latitude: res.data[i].location.lat,
              //     longitude: res.data[i].location.lng,
              //     iconPath:"../images/locat.png",
              //     width:20,
              //     height:20,
              //     address:res.data[i].address,
              //     distance: dist.toFixed(2) * 1000,
              //     statrs : that.starCount(sum)
                  
              //   }),
                
              
              

              // resolve(that.data)
              // return that.data.averge
              
            
              
                            
              

           
          
      })
      // .then(function (res){
      //   console.log(res.averge)
        
      // })
      // console.log(a)
      // console.log(that.data.averge)
        return a;
    }


})