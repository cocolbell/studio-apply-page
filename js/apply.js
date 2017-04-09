$(function(){
	//创建模态框的构造函数
	function log(text){
		return{
			tip:function(text){
				$(".model-tip").addClass("model-tip-active").find("span").text(text);
				$(".mask").show();
			},
			tipClose:function(){
				$(".model-tip").removeClass("model-tip-active").find("span").text("");
				$(".mask").hide();
			},
			dialog:function(){
				$(".testImg").attr("src","auth-code");
				$(".model-dialog").addClass("model-dialog-active");
				$(".mask").show();
			},
			dialogClose:function(){
				$(".model-dialog").removeClass("model-dialog-active");
				$(".mask").hide();
				$(".testImg").attr('src','auth-code?abc='+Math.random());
				$(".testNum").val("");
			}
		};
	};
	var myLog = new log();
	$(".mask").click(function(){
		myLog.tipClose();
		myLog.dialogClose();
	});
	
	//
	function scroll(targetTop,second){
		targetTop = parseInt(targetTop) - 300;
		if(!second) second = 100;
		$('html, body').animate({scrollTop:targetTop});
	}
	//性别模块
	$("#genderChange").click(function(){
		var cont = $(this).text(); 
		if(cont == "男") {
			$(this).text("女");
			$(this).next().val("女");
		}
		else {
			$(this).text("男");
			$(this).next().val("男");
		}
	})

	//方向选择模块
	$(".checkBox").mouseenter(function(){
		$(this).addClass("checkBox-hover");
	}).mouseleave(function(){
		$(this).removeClass("checkBox-hover");
	});
	$(".checkBox").click(function(){
		$(".checkBox-active").removeClass("checkBox-active");
		$(this).addClass("checkBox-active");
	})

	//表单验证模块
	function validate(){
		//闭包里面的私有变量
		var allow = true;
		var formRule = {
			name : {
				necessary : true,
				regexpStr : "^[\u4e00-\u9fa5]{0,10}$"
			},
			identity : {
				necessary : true,
				regexpStr : "^3(1|2)16\\d{6}$"
			},
			college : {
				necessary : true
			},
			majorAndClass : {
				necessary : true
			},
			job : {
				necessary : false
			},
			phoneNumber : {
				necessary : true,
				regexpStr : "^1(3[0-9]|5[0-35-9]|8[025-9])\\d{8}$"
			},
			shortNumber : {
				necessary : false,
				regexpStr : "^[1-9]\\d{3,10}$"
			},
			email : {
				necessary : false,
				regexpStr : "^(\\w)+(\\.\\w+)*@(\\w)+((\\.\\w{2,3}){1,3})$"
			},
			qq : {
				necessary : true,
				regexpStr : "^[1-9]\\d{6,10}$"
			},
			specialty : {
				necessary : false
			},
			selfIntroduction : {
				necessary : true
			},
			expection : {
				necessary : false
			}
		};
		//validate的test方法
		var test = function(){
			$(".data-for-user").each(function(){
				var attr = $(this).attr("name");
				var text = $(this).val();
				//获取第一个文本节点
				var label = $(this).prev().contents().filter(function() {
				    return this.nodeType === 3;
				}).text();
				//必填项的格式验证
				if(formRule[attr].necessary) {
					//验证格式
					if(text) {
						if(formRule[attr].regexpStr){
							var patt = new RegExp(formRule[attr].regexpStr);
							var regAllow = patt.test(text);
							if(regAllow){
								// myLog.tip(label+"验证成功");
							}
							else{
								allow = false;
								var targetTop = $(this).offset().top;
								scroll(targetTop,second);
								myLog.tip(label+"格式错误,请重新核对");
								return false;
							}
						}
					}
					else {
						allow = false;
						var targetTop = $(this).offset().top;
						scroll(targetTop,second);
						myLog.tip(label+"不能为空");
						return false;
					}
				}
				//选填项的格式验证
				else if(text && formRule[attr].regexpStr){
					var patt = new RegExp(formRule[attr].regexpStr);
					var regAllow = patt.test(text);
					if(regAllow){
						// myLog.tip(label+"验证成功");
					}
					else{
						allow = false;
						var targetTop = $(this).offset().top;
						scroll(targetTop,second);
						myLog.tip(label+"格式错误,请重新核对");
						return false;
					}
				}
			})
			return allow;
		}
		//暴露的接口
		return {
			test : test
		}
	}
	$("#submitBtn").click(function(){
		var ajaxAllow = validate().test();
		if(ajaxAllow) {
			myLog.dialog();
		}
		else{
			// console.log("验证出错");
		}
	});
	$("#confirmBtn").click(function(){
		var testNum = $(".testNum").val();
		if(!testNum) $(".help-block").show();
		else{
			myLog.dialogClose();
			var userInfo = {};
			$(".form-text").each(function(){
				var attr = $(this).attr("name");
				if($(this).val()) userInfo[attr] = $(this).val();
				else userInfo[attr] = "";
			});
			userInfo.direction = $(".checkBox-active").attr("choice");
			//性别
			if($("#genderReal").val() == "男") userInfo.gender = 1;
			else userInfo.gender = 0;
			//验证码
			userInfo.authCode = testNum;
			// var userInfoJson = JSON.stringify(userInfo);
			$.ajax({
				type: "POST",
				url: "enrolment",
				dataType: "json",
				data : {
					name : userInfo.name,
					identity : userInfo.identity,
					college : userInfo.college,
					majorAndClass : userInfo.majorAndClass,
					gender : userInfo.gender,
					job : userInfo.job,
					domitory : userInfo.domitory,
					phoneNumber : userInfo.phoneNumber,
					shortNumber : userInfo.shortNumber,
					email : userInfo.email,
					qq : userInfo.qq,
					direction : userInfo.direction,
					selfIntroduction : userInfo.selfIntroduction,
					expection : userInfo.expection, 
					authCode : userInfo.authCode
				},
				// beforeSend: function(){
				// 	
				// },
				success : function(data){
					if(data.result == "success"){
						myLog.tip("报名成功");
					}
					else if(data.result == "failed"){
						myLog.tip(data.reason);
					} 
				},
				error : function(data){
					myLog.tip("提交失败，请检查网络连接");
				}
			});
		}
	});
	$("#refuseBtn").click(function(){
		myLog.dialogClose();
	});
	$(".testImg").click(function(){
		$(this).attr('src','auth-code?abc='+Math.random());
	});
	$(".testNum").blur(function(){
		var value = $(this).val();
		if(value)  $(".help-block").hide();
	})
});