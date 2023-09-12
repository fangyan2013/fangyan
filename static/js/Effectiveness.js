
function not_null(val,hint){
    layui.use('layer', function(){
		var layer = layui.layer;
		if (val===''){
			alert('1231234')
			layer.msg(hint);
			
		}
    })
}              
      

$("body").on("click", "#shut_down", function() {
    console.log($("#myDiv",window.parent.parent.document),'触发没')
    $("#myDiv",window.parent.parent.document).show()
    // $("#myDiv").show()
})


// $(document).ajaxComplete(function (ajaxCompleteevent, xhr, settings) {
//   console.log(" xhrxhrxhrxhrxhrxhr ",xhr)
//   redirectHandle(xhr);
// })


// function  redirectHandle(xhr) {
// //获取后台返回的参数

//   var url = xhr.getResponseHeader("redirectUrl");
//   console.log("redirectUrl = " + url);


//   var urlall = xhr.getAllResponseHeaders();
//   console.log("urlall = " + urlall);

  
//   // var enable = xhr.getResponseHeader("enableRedirect");
//   var enable = xhr.getResponseHeader('Content-type');
//   var type = xhr.getResponseHeader('Content-type');
//   console.log('Content-type响应头字段：', type);


//   if((enable == "true") && (url != "")){
//       var win = window;
//       while(win != win.top){
//           win = win.top;
//       }
//       win.location.href = url;
//   }
// }