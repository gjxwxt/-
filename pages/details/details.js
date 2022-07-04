// pages/details/details.js
const app = getApp();
// import dataFor from "../index/index"
Page({
    data: {
        baseUrl: app.globalData.baseConnected,
        productList: [],
        productListPick: [],
        //最下面三个块的选择
        pick: 1,
        activityArr: [{
                id: 1
            },
            {
                id: 2
            },
            {
                id: 3
            },
            {
                id: 4
            }, {
                id: 5
            }, {
                id: 6
            }, {
                id: 7
            }
        ],
        cartAllProduct: 0,
        logProductCounts: app.globalData.logProductCounts,
        setIndex: 0,
        id: 0
    },
    onLoad(options) {
        let id = options.id;
        //详情图片
        app.toRequest(`/api/v1/product/${id}`, 'GET', {}, 2).then(res => {
            this.setData({
                productList: res.data.data,
                productListPick: {
                    "id": res.data.data.id,
                    "name": res.data.data.name,
                    "price": res.data.data.price,
                    "main_img_url": res.data.data.main_img_url,
                    "selectStatus": false,
                    "counts": 0
                },
                id: id
            })
        })
    },
    onShow() {
        // 找本地缓存中有多少商品
        let target = wx.getStorageSync('cartList'),
            cartAllProduct;
        if (target) {
            cartAllProduct = target.reduce((sum, current) => sum + current.counts, 0);
            this.setData({
                cartAllProduct
            })
        }
    },
    onHide() {
        // console.log(this.data.cartAllProduct)
    },
    //返回上一级页面
    back() {
        wx.navigateBack({
            delta: 1,
        })
    },
    toCart() {
        wx.switchTab({
            url: '/pages/cart/cart',
        })
    },
    bindPickerChange(e) {
        this.setData({
            setIndex: parseInt(e.detail.value)
        })
        // console.log(this.data.setIndex);
    },
    // picker组件的选择
    pick(e) {
        this.setData({
            pick: e.target.dataset.id
        })
    },
    // 加入购物车之后
    addCart() {
        let target = wx.getStorageSync('cartList'),
            index, hasProduct, item;
        item = this.data.productListPick;
        item.counts = this.data.setIndex + 1;
        //如果之前没有购物车缓存5
        if (!target) {
            wx.setStorageSync('cartList', [item])
        } else {
            // 判断我要添加的信息缓存中有没有
            for (let i = 0; i < target.length; i++) {
                //缓存没有哦
                if (this.data.id == target[i].id) {
                    index = i;
                    hasProduct = true;
                    break;
                } else {
                    //缓存里没有
                    hasProduct = false
                }
            }
            if (hasProduct) {
                item.counts += target[index].counts;
                target[index] = item;
            } else {
                target.push(item)
            }
            this.setData({
                cartAllProduct: this.data.cartAllProduct + this.data.setIndex + 1,
                productListPick: item
            })
            wx.setStorageSync('cartList', target);
        }
    },

})