// logs.js
// const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    baseUrl:app.globalData.baseConnected,
    currentList:[],
    productList:[],
    topPicture:[],
    nowfloor:2,
  },
  onLoad() {
    app.toRequest('/api/v1/category/all','GET',{},2).then(res=>{this.setData({
        "currentList":res.data.data,
        "topPicture":res.data.data.filter(item=>item.id==2),
    })});
    app.toRequest('/api/v1/product/by_category','GET',{id:2},2).then(res=>{this.setData({
        productList:res.data.data,
    })})
    
  },
  onHide(){
    //   console.log(this.data.productList)
  },
  changeFloor(e){
    let nowfloor=e.currentTarget.dataset.id,
    topPicture=this.data.currentList.filter(item=>item.id===nowfloor)
    // app.appData.nowfloor=nowfloor;
    // if(!this.data[`this.data.nowfloor${nowfloor}`]){
        if(this.data.nowfloor!==nowfloor)
        this.setData({
            nowfloor:nowfloor,
            topPicture
        })
        app.toRequest('/api/v1/product/by_category','GET',{id:`${this.data.nowfloor}`},2).then(res=>{this.setData({
            productList:res.data.data,
            // `nowfloor${nowfloor}`:
        })})
    },
    changeDetails(e){
        let id=e.currentTarget.dataset.id;
        wx.navigateTo({
          url: `/pages/details/details?id=${id}`,
        })
    }
    
//   }

})
