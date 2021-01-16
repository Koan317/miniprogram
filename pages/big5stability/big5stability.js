// miniprogram/pages/big5Stability/big5Stability.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		openId: '', //用户ID
		question: [], //题目
		result: [], //测试结果
		score: 0, //最后得分
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		if (app.globalData.openid) {
			this.setData({
				openId: app.globalData.openid
			})
		}

		const db = wx.cloud.database()
		// 查询当前用户所有的 counters
		db.collection('questions').doc('f22b28525fc25b63005cbc391a80da30').get({
			success: res => {
				this.setData({
					question: res.data.Quiz
				})
			},
			fail: err => {
				console.error('[questions] [查询记录] 失败：', err)
			}
		})
	},

	onSubmit: function (e) {
		var resultJSON = e.detail.value //截取传送进来的信息中的需要部分，存进一个变量里
		var radioList = new Map() //创建一个Map
		var flag = false //用来存储是否有未答项	
		for (let i of Object.keys(resultJSON)) { //将截取的信息传进Map里方便处理
			if (!parseInt(resultJSON[i])) {
				flag = true
				break
			}
			radioList.set(i, parseInt(resultJSON[i]))
		}

		if (flag == true) {
			wx.showToast({
				title: '有题目未作答',
				icon: 'none'
			})
		} else if (radioList.size == 0) {
			wx.showToast({
				title: '网络不佳，请刷新页面',
				icon: 'none'
			})
		} else {
			var big5Score = 0 //得分
			var reversePT = new Array(21).fill(0) //反向记分的标记
			reversePT[0] = reversePT[3] = reversePT[6] = reversePT[9] = reversePT[13] = reversePT[14] = reversePT[15] = reversePT[16] = reversePT[17] = reversePT[18] = reversePT[19] = reversePT[20] = 1
			/**
			 * 记分开始
			 */
			for (let i = 0; i < 21; i++) {
				if (reversePT[i] == 1) {
					big5Score += (-(radioList.get(String(i + 1)) - 6))
				} else {
					big5Score += radioList.get(String(i + 1))
				}
			}
			/**
			 * 记分结束
			 */
			const db = wx.cloud.database() //读写云数据库
			wx.showLoading({
				title: '提交中',
				mask: true
			})
			db.collection('big5StabilityrResults').add({
				data: {
					openId: app.openid,
					big5Score: big5Score,
					result: e.detail.value
				},
				success: res => {
					this.setData({
						score: big5Score
					})
					wx.hideLoading()
					wx.showToast({
						title: '得分' + big5Score + '分',
						duration: 2000,
						success: function () {
							setTimeout(() => {
								wx.navigateTo({
									url: '/pages/testReport/testReport?score=' + big5Score + '&type=big5Stability'
								})
							}, 2000);
						}
					})
				},
				fail: err => {
					wx.showToast({
						icon: 'none',
						title: '提交失败'
					})
					console.error('[big5StabilityResults] [新增记录] 失败：', err)
				}
			})
		}
	},
})
