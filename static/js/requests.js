const request = require('request')

//后面改成http模块封装吧,nodejs的request太搞了不好用
//npm install --save request
//npm install --save playwright

var synchronous_post = function (url,Data,head,run) {
	var url=url;
	var Data=Data;
	var head=head;
	var run=run;
    return new Promise(
		function (url,Data,head,run){
			if(head['content-type']=="application/json" || head['Content-Type']=="application/json"){//application/json的时候转换成json
				console.log("request_post")
				return new Promise(
					request({
						url: url,
						method: "POST",
						json: true,
						headers: head,	
						body: Data//会自动帮转一次json
					}, function(error, response, body) {
						console.log(error,'requests_error') // 请求成功的处理逻辑
						//console.log(response,'requests_response') // 请求成功的处理逻辑
						console.log(body,'requests_body') // 请求成功的处理逻辑
						if(error){
							run(error,"error") 
						}else if(body){
							run(body,"success") 
						}
					})
				)
	
			}else if(head['content-type']=="application/x-www-form-urlencoded"|| head['Content-Type']=="application/x-www-form-urlencoded"){
				console.log("进入到了x-www-form-urlencoded的那个")
				request.post({
					url:url,
					form:{key:'value'},
					headers: head,
				}, function(error, response, body) {
					return body
					// if (!error && response.statusCode == 200) {
					// 	console.log(body) // 请求成功的处理逻辑
					// }
				})
			}else{
				console.log("目前只支持application/json,application/x-www-form-urlencoded") // 请求成功的处理逻辑
			}
		}

	);
}



var syncBody = async function (url,Data,head,run) {
    // let url = "http://www.baidu.com/";
    let body = await synchronous_post(url,Data,head,run);
    console.log('##### BBBBB', body);
    return JSON.parse(body);
}


//var body = syncBody(url,Data,head,run);



module.exports = {

	request_get :function(url){
		// this.request_get = function(url,Data,head){
		// 	request({
		// 		url: url,
		// 		method: "GET",
		// 		headers: head,	
		// 		body: Data
		// 	}, function(error, response, body) {
		// 		return body
		// 		// if (!error && response.statusCode == 200) {
		// 		// 	console.log(body) // 请求成功的处理逻辑
		// 		// }
		// 	}); 

		// }

			request(
				url
			, function(error, response, body) {
				console.log(body,'get_fanhuizhi')
				return body
				// if (!error && response.statusCode == 200) {
				// 	console.log(body) // 请求成功的处理逻辑
				// }
			}); 
	},
	request_post :function(url,Data,head,run){
		syncBody(url,Data,head,run)
	}
	
	// function (url,Data,head,run){
	// 	if(head['content-type']=="application/json" || head['Content-Type']=="application/json"){//application/json的时候转换成json
	// 		console.log("request_post")
	// 		return new Promise(
	// 			request({
	// 				url: url,
	// 				method: "POST",
	// 				json: true,
	// 				headers: head,	
	// 				body: Data//会自动帮转一次json
	// 			}, function(error, response, body) {
	// 				console.log(error,'requests_error') // 请求成功的处理逻辑
	// 				//console.log(response,'requests_response') // 请求成功的处理逻辑
	// 				console.log(body,'requests_body') // 请求成功的处理逻辑
	// 				if(error){
	// 					run(error,"error") 
	// 				}else if(body){
	// 					run(body,"success") 
	// 				}
	// 			})
	// 		)

	// 	}else if(head['content-type']=="application/x-www-form-urlencoded"|| head['Content-Type']=="application/x-www-form-urlencoded"){
	// 		console.log("进入到了x-www-form-urlencoded的那个")
	// 		request.post({
	// 			url:url,
	// 			form:{key:'value'},
	// 			headers: head,
	// 		}, function(error, response, body) {
	// 			return body
	// 			// if (!error && response.statusCode == 200) {
	// 			// 	console.log(body) // 请求成功的处理逻辑
	// 			// }
	// 		})
	// 	}else{
	// 		console.log("目前只支持application/json,application/x-www-form-urlencoded") // 请求成功的处理逻辑
	// 	}


		
	// }

};

