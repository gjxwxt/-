const app = getApp()
Page({
    data: {
        baseUrl: app.globalData.baseConnected,
        currentList: [],
        currentTheme: [],
        productList: [],
    },
    onLoad: function () {
        let callback = () => {
            let brr = [],
                crr = [],
                drr = [];
            //请求banner信息
            app.toRequest('/api/v1/banner/1', 'GET', {}).then(res => {
                res.data.data.items.forEach(item => {
                    brr.push(item.img.url),
                        this.setData({
                            'currentList': brr
                        })
                })
                brr = [];
            })
            //请求主题信息
            let callback1= app.toRequest('/api/v1/theme', 'GET', {
                ids: 1
            }),
            callback2=app.toRequest('/api/v1/theme', 'GET', {
                ids: 2
            }),
            callback3=app.toRequest('/api/v1/theme', 'GET', {
                ids: 3
            });
            Promise.all([callback1,callback2,callback3]).then(res=> {
                res.forEach(item=>{
                    crr.push(item.data.data[0])
                });
                this.setData({
                    currentTheme:crr
                })
            })     
            //请求新品信息
            app.toRequest('/api/v1/product/recent', "GET", {}, 2).then(res => {
                drr = res.data.data,this.setData({
                    productList: drr,
                })
            })
        };
        let fn=()=>{
            if(wx.getStorageSync('token')==''){
                setTimeout(fn,17)
            }
            else{
                callback()
            }
        }
        fn()
    },
    onShow() {
         app.globalData.abc=10
    },
    changeDetails(e){
        let id=e.currentTarget.dataset.id;
        wx.navigateTo({
          url: `/pages/details/details?id=${id}`,
        })
    }
})