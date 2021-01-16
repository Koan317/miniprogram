// miniprogram/pages/tatueHarmony/tatueHarmony.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		openid: '', //用户ID
		nickName: '',
		question: [], //题目
		result: [], //测试结果
		score: 0, //最后得分
		scoreList: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (app.globalData.openid) {
			this.setData({
				openid: app.globalData.openid
			})
		}

		const db = wx.cloud.database()
		db.collection('questions').doc('4fb129165fce05c0019356fe285e2ac8').get({
			success: res => {
				this.setData({
					question: res.data.Quiz,
					scoreList: options.scoreList
				})
			}
		})
	},

	onGetUserInfo(e) {
		this.setData({
			nickName: e.detail.userInfo.nickName
		})
	},

	onSubmit: function (e) {
		var resultJSON = e.detail.value //截取传送进来的信息中的需要部分，存进一个变量里
		var radioList = new Map() //创建一个Map
		var flag = false //用来存储是否有未答项	
		for (let i of Object.keys(resultJSON)) { //将截取的信息传进Map里方便处理
			if (!parseInt(resultJSON[i])) {
				flag = true
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
			var harmoScore = -1
			if (this.data.scoreList.length != 0) {
				harmoScore = 42
				let tempList = this.data.scoreList
				let cmprList = []
				for (let i of tempList) {
					cmprList[i] = parseInt(tempList[i])
				}
				var confictFlag = new Array(13).fill(0)
				/**
				 * ------------------匹配开始------------------
				 */
				if (radioList.get(String(2) - cmprList[0] > 1)) { confictFlag[0] = 1; harmoScore-- }//抽烟
				if (cmprList[1] - radioList.get(String(1)) > 1) { confictFlag[0] = 1; harmoScore-- }
				if (radioList.get(String(4) - cmprList[2] > 1)) { confictFlag[1] = 1; harmoScore-- }//喝酒
				if (cmprList[3] - radioList.get(String(3)) > 1) { confictFlag[1] = 1; harmoScore-- }
				if (radioList.get(String(6) - cmprList[4] > 1)) { confictFlag[2] = 1; harmoScore-- }//宗教
				if (cmprList[5] - radioList.get(String(5) > 1)) { confictFlag[2] = 1; harmoScore-- }
				if (Math.abs(radioList.get(String(8)) - cmprList[6]) > 1) { confictFlag[3] = 1; harmoScore-- }//依赖
				if (Math.abs(radioList.get(String(9)) - cmprList[8]) > 1) { confictFlag[4] = 1; harmoScore-- }//性与情感1
				if (Math.abs(radioList.get(String(10)) - cmprList[9]) > 1) { confictFlag[4] = 1; harmoScore-- }//性与情感2
				if (Math.abs(radioList.get(String(11)) - cmprList[10]) > 1) { confictFlag[5] = 1; harmoScore-- }//子女1
				if (Math.abs(radioList.get(String(12)) - cmprList[11]) > 1) { confictFlag[5] = 1; harmoScore-- }//子女2
				if (Math.abs(radioList.get(String(13)) - cmprList[12]) > 1) { confictFlag[5] = 1; harmoScore-- }//子女3
				if (Math.abs(radioList.get(String(14)) - cmprList[13]) > 1) { confictFlag[5] = 1; harmoScore-- }//子女4
				if (Math.abs(radioList.get(String(15)) - cmprList[14]) > 1) { confictFlag[6] = 1; harmoScore-- }//平等角色1
				if (Math.abs(radioList.get(String(16)) - cmprList[15]) > 1) { confictFlag[6] = 1; harmoScore-- }//平等角色2
				if (Math.abs(radioList.get(String(17)) - cmprList[16]) > 1) { confictFlag[6] = 1; harmoScore-- }//平等角色3
				if (Math.abs(radioList.get(String(18)) - cmprList[17]) > 1) { confictFlag[7] = 1; harmoScore-- }//财务管理1
				if (Math.abs(radioList.get(String(19)) - cmprList[18]) > 1) { confictFlag[7] = 1; harmoScore-- }//财务管理2
				if (radioList.get(String(20)) > 3) { confictFlag[8] = 1; harmoScore-- }//家庭和朋友1
				if (cmprList[19] > 3) { confictFlag[8] = 1; harmoScore-- }//家庭和朋友1
				if (radioList.get(String(21)) > 3) { confictFlag[8] = 1; harmoScore-- }//家庭和朋友2
				if (cmprList[20] > 3) { confictFlag[8] = 1; harmoScore-- }//家庭和朋友2
				if (radioList.get(String(22)) > 3) { confictFlag[9] = 1; harmoScore-- }//冲突解决1
				if (cmprList[21] > 3) { confictFlag[9] = 1; harmoScore-- }//冲突解决1
				if (radioList.get(String(23)) > 3) { confictFlag[9] = 1; harmoScore-- }//冲突解决2
				if (cmprList[22] > 3) { confictFlag[9] = 1; harmoScore-- }//冲突解决2
				if (radioList.get(String(24)) > 3) { confictFlag[9] = 1; harmoScore-- }//冲突解决3
				if (cmprList[23] > 3) { confictFlag[9] = 1; harmoScore-- }//冲突解决3
				if (radioList.get(String(25)) > 3) { confictFlag[10] = 1; harmoScore-- }//沟通1
				if (cmprList[24] > 3) { confictFlag[10] = 1; harmoScore-- }//沟通1
				if (radioList.get(String(26)) > 3) { confictFlag[10] = 1; harmoScore-- }//沟通2
				if (cmprList[25] > 3) { confictFlag[10] = 1; harmoScore-- }//沟通2
				if (radioList.get(String(27)) > 3) { confictFlag[10] = 1; harmoScore-- }//沟通3
				if (cmprList[26] > 3) { confictFlag[10] = 1; harmoScore-- }//沟通3
				if (radioList.get(String(28)) > 3) { confictFlag[11] = 1; harmoScore-- }//人格问题1
				if (cmprList[27] > 3) { confictFlag[11] = 1; harmoScore-- }//人格问题1
				if (radioList.get(String(29)) > 3) { confictFlag[11] = 1; harmoScore-- }//人格问题2
				if (cmprList[28] > 3) { confictFlag[11] = 1; harmoScore-- }//人格问题2
				if (radioList.get(String(30)) > 3) { confictFlag[12] = 1; harmoScore-- }//金钱观1
				if (cmprList[29] > 3) { confictFlag[12] = 1; harmoScore-- }//金钱观1
				if (radioList.get(String(31)) > 3) { confictFlag[12] = 1; harmoScore-- }//金钱观2
				if (cmprList[30] > 3) { confictFlag[12] = 1; harmoScore-- }//金钱观2
				harmoScore = Math.round(harmoScore / 42 * 100)
				/**
				 * ------------------匹配结束------------------
				 */
				var flagDetail = ['抽烟、', '喝酒、', '宗教、', '依赖、', '性与情感、', '子女、', '平等角色、', '财务管理、', '家庭和朋友、', '冲突解决、', '沟通、', '人格问题、', '金钱观、']
				var unharm, harm = ''
				for (let i = 0; i < 13; i++) {
					if (confictFlag[i]) {
						unharm += flagDetail[i]
					} else {
						harm += flagDetail[i]
					}
				}
				unharm = unharm.substring(0, unharm.length - 1)
				harm = harm.substring(0, harm.length - 1)
				if (unharm.length == 0) {
					harm = '你们在' + harm + '问题上都很合拍。'
				} else if (harm.length == 0) {
					unharm = '你们在' + unharm + '问题上似乎存在矛盾，需要进一步沟通。'
				} else {
					harm = '你们在' + harm + '问题上都很合拍。'
					unharm = '你们在' + unharm + '问题上似乎存在矛盾，需要进一步沟通。'
				}
				var url = '/pages/big5report/big5report?score=' + harmoScore + '&type=tatueharmony&nickName=' + this.nickName + '&harm=' + harm + '&unharm' + unharm
			} else {
				let scoreString = ''
				for (let i = 0; i < 31; i++) {
					scoreString += resultJSON[i]
				}
				url = '/pages/testReport/testReport?type=tatueHarmony&scoreList=' + scoreString + '&nickName=' + this.nickName
			}
			const db = wx.cloud.database() //读写云数据库
			wx.showLoading({
				title: '提交中',
				mask: true
			})
			db.collection('tatueHarmony').add({
				data: {
					openId: app.openid,
					nickName: this.nickName,
					harmoScore: harmoScore,
					result: e.detail.value
				},
				success: res => {
					wx.hideLoading()
					wx.showToast({
						title: '提交完成',
						duration: 2000,
						success: function () {
							setTimeout(() => {
								wx.navigateTo({
									url: url
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
					console.error('[tatueHarmony] [新增记录] 失败：', err)
				}
			})
		}
	},
})
