// pages/my/my.js
let app = getApp();
Page({
    data: {
        baseUrl: app.globalData.baseConnected,
        page:1,
        productList:[]
    },
    onLoad(options) {
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            userInfo.address = userInfo.provinceName + userInfo.cityName + userInfo.countyName + userInfo.detailInfo;
            this.setData({
                userInfo,
            });
        }
        
    },
    request(){
        app.toRequest('/api/v1/order/by_user', 'GET', {
            page: 1
        }, 2, {
            page: this.data.page,
            size: 15
        }).then(res => {
            this.setData({
                productList: this.data.productList.concat(res.data.data.data.data)
            })
        })
    },
    onReady() {
    },
    getaddress() {
        return new Promise(resolve => {
            wx.chooseAddress({
                success: (result) => {
                    resolve(result)
                },
            })
        })

    },
    pickAddress() {
        this.getaddress().then(res => {
            res.address=res.address = res.provinceName + res.cityName + res.countyName + res.detailInfo;
            this.setData({
                userInfo: res
            })
            wx.setStorageSync('userInfo', this.data.userInfo)
        })
    },
    topay(e){
        let id=e.currentTarget.dataset.id;
        this.setData({
            id
        })
        app.toRequest('/api/v1/pay/pre_order', 'POST', {
            "id": id
        }, 2).then(res => {
            wx.requestPayment({
                nonceStr: `${res.nonceStr}`,
                package: `${this.data.id}`,
                paySign: `${res.paySign}`,
                timeStamp: `${res.timeStamp}`,
                signType: 'md5',
                fail: () => {
                    wx.navigateTo({
                        url: '/pages/payResult/payResult',
                    })
                }
            })
        })
    },
    topaydetail(e){
        wx.navigateTo({
          url: `/pages/pay/pay?id=${e.currentTarget.dataset.id}`,
        })
    },
    onShow() {
        this.request();
    },
    onReachBottom() {
        let page=this.data.page;
        page++;
        this.setData({page})
        this.request()
    },
    onUnload(){
        this.setData({page:1})
    },
})