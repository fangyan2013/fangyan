
function not_null(val,hint){
    layui.use('layer', function(){
		var layer = layui.layer;
		if (val===''){
			alert('1231234')
			layer.msg(hint);
			
		}
    })
}              
      