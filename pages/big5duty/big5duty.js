// miniprogram/pages/big5duty/big5duty.js
const app = getApp()

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		openid: '', //用户ID
		question: [], //题目
		result: [], //测试结果
		resultid: '', //结果ID
		score: 0, //最后得分
		report: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (_options) {
		if (app.globalData.openid) {
			this.setData({
				openid: app.globalData.openid
			})
		}

		const db = wx.cloud.database()
		// 查询当前用户所有的 counters
		db.collection('big5').doc('f22b28525fc25b00005cbc372a2a6521').get({
			success: res => {
				this.setData({
					question: res.data.Quiz
				})
				console.log('[数据库] [查询记录] 成功: ', res.data._id)
			},
			fail: err => {
				console.error('[数据库] [查询记录] 失败：', err)
			}
		})
	},

	onSubmit: function (e) {
		var resultjson = e.detail.value //截取传送进来的信息中的需要部分，存进一个变量里
		var radiolist = new Map() //创建一个Map
		var flag = false //用来存储是否有未答项	
		for (let i of Object.keys(resultjson)) { //将截取的信息传进Map里方便处理
			if (!parseInt(resultjson[i])) {
				flag = true
			}
			radiolist.set(i, parseInt(resultjson[i]))
			//console.log('radiolist:', radiolist.get(String(i)))
		}

		if (flag == true) {
			wx.showToast({
				title: '有题目未作答',
				icon: 'none'
			})
		} else if (radiolist.size == 0) {
			wx.showToast({
				title: '网络不佳，请刷新页面',
				icon: 'none'
			})
		} else {
			var tinycode = new Array(140).fill(0) //小码的二进制
			var big5score = 0 //得分
			var reversept = new Array(12).fill(0) //反向记分的标记
			reversept[2] = reversept[5] = reversept[8] = reversept[10] = 1
			for (let i = 0; i < 12; i++) { //记分开始
				if (reversept[i] == 1) {
					big5score += (-(radiolist.get(String(i + 1)) - 6))
				} else {
					big5score += radiolist.get(String(i + 1))
				}
			} //记分结束
			/*
			//小码编码（有bug未解决）
			for (let index = 0,scortemp=big5score; scortemp < 2; index++) {
				//将分数转化为2进制存进tinycode
				tinycode[9-index]=scortemp%2
				scortemp=parseInt(scortemp/2)
			}
			var quizcode=[0,0,0,0,1,0,1,0,1,1]//自定义的试卷编号
			for (let index = 0; index < quizcode.length; index++) {
				//将试卷编号存进tinycode
				tinycode[10+index]=quizcode[index]
			}
			for (let index = 0; index < 36; index+=3) {
				//将答题记录存进tinycode
				switch (radiolist.get(String(i/3+1))) {
					case 0:
						//tinycode[104+index]=tinycode[105+index]=tinycode[106+index]=0
						break
					case 1:
						//tinycode[104+index]=tinycode[105+index]=0
						tinycode[106+index]=1
						break
					case 2:
						//tinycode[104+index]=tinycode[106+index]=0
						tinycode[105+index]=1
						break
					case 3:
						//tinycode[104+index]=0
						tinycode[105+index]=tinycode[106+index]=1
						break
					case 4:
						//tinycode[105+index]=tinycode[106+index]=0
						tinycode[104+index]=1
						break
					case 5:
						tinycode[104+index]=tinycode[106+index]=1
						//tinycode[105+index]=0
						break
				}
			}
			//存储结束
			var tinyEcode=new Aarry(28)//小码的32进制
			var codenum=['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','X','Y','Z','1','2','3','4','5','6','7','8','9']
			for (let index = temp=0; index < 140; index+=5) {
				//将2进制小码转换为32进制小码并存储
				temp=tinycode[index]*16+tinycode[index+1]*8+tinycode[index+2]*4+tinycode[index+3]*2+tinycode[index+4]
				tinyEcode[index/5]=codenum[temp]
			}
			*/
			//console.log(tinyEcode)
			const db = wx.cloud.database() //读写云数据库
			wx.showLoading({
				title: '提交中',
				mask: true
			})
			db.collection('big5dutyresults').add({
				data: {
					openId: app.openid,
					big5score: big5score,
					result: e.detail.value
				},
				success: res => {
					// 在返回结果中会包含新创建的记录的 _id
					this.setData({
						result: [],
						resultid: res._id,
						score: big5score
					})
					wx.hideLoading()
					wx.showToast({
						title: '得分' + big5score + '分',
						duration: 2000,
						success: function () {
							setTimeout(() => {
								wx.navigateTo({
									url: '/pages/big5report/big5report?score=' + big5score + '&type=big5duty'
								})
							}, 2000);
						}
					})
					console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
				},
				fail: err => {
					wx.showToast({
						icon: 'none',
						title: '提交失败，请检查网络'
					})
					console.error('[数据库] [新增记录] 失败：', err)
				}
			})
		}
	},
})
