var edit_id = localStorage.getItem("edit_id")
var editor = ace.edit("editor");
this.editor.setTheme('ace/theme/gob');
editor.session.setMode("ace/mode/python");
editor.resize()
$.ajax({//查询sql节点数据
	url:"/GetNode/",
	type:"POST",                    
	data:{
		'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		'nodeid':edit_id,
	},
	success:function (data) {
		PositionVal=JSON.parse(data['data'])
		if (PositionVal){
			PositionVal=JSON.parse(PositionVal['nodejson'])
			PositionVal[edit_id].Workflow_name
			if(PositionVal.hasOwnProperty(edit_id)){
				//回显
				$('#myP').text(PositionVal[edit_id].Workflow_name)
				$('textarea[name="http_url"]').val(PositionVal[edit_id].http_url)
				$('input[name="file_name"]').val(PositionVal[edit_id].file_name)
				editor.getSession().setValue(PositionVal[edit_id].editor_value)
			}
		}
	},
	error:function (data) {
		console.log("失败",data);
	}
})

$("#shut_down").click(function(){
	//关闭判断节点
	$(".popping-box-wrap", parent.document).hide(500);
});

$( "#myP" ).click(function(e){//点击时可编辑
	var x = document.getElementById("myP");
	x.contentEditable = "true";
	$("#myP").focus();
})
			
$("#myP").focus(function(){//聚焦改变颜色
	var x = document.getElementById("myP");
	x.style.color='#000000'
});
			
$( "#myP" ).blur(function(){//失去改变颜色不可编辑
	var x = document.getElementById("myP");
	x.contentEditable = "false";
	x.style.color='#7d7d7d'
});

$("#recording").click(function(){
    //点击录制
	$.ajax({
	   url:"/rpa_Recording_000/",
	   type:"POST",                    
	   data:{
		   'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		   'file_name':$('input[name="file_name"]').val(),
		   'file_url':$('textarea[name="http_url"]').val(),
	   },
	   success:function (data) {
			editor.getSession().setValue(data['data'])
	   },
	   error:function (data) {
		    layer.close(index);
	   }
	});
}); 

$("#rpa_test").click(function(){
    //点击测试
	$.ajax({
	   url:"/rpa_test_000/",
	   type:"POST",                    
	   data:{
		   'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		   "file_name":$('input[name="file_name"]').val(),
	   },
	   success:function (data) {
			console.log('成功',data,'成功人事达文西')
	   },
	   error:function (data) {
		   console.log("失败",data);
	   }
	});	
})

$("#Save_node").click(function(){
    //点击保存
	if ($('#myP').text()===''){//url非空
		layer.msg('节点名称不能空'); 
		return
	}else if($('textarea[name="http_url"]').val()===''){//工作流名称非空
		layer.msg('url不能空'); 
		return
	}else if($('input[name="file_name"]').val()===''){//工作流名称非空
		layer.msg('文件名称不能空'); 
		return
	}else if(editor.getValue()===''){//工作流名称非空
		layer.msg('脚本不能空'); 
		return
	}
    recording_val={
		"Workflow_name":$('#myP').text(),
		"http_url":$('textarea[name="http_url"]').val(),
		"file_name":$('input[name="file_name"]').val(),
		"editor_value":editor.getValue()
	}
	var recording_obj={}
	recording_obj[edit_id]=recording_val
	$.ajax({//节点保存到redis
        url:"/AddNode/",
        type:"POST",                    
        data:{
            'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),		   
            'nodeid':edit_id,
			"Workflow_name":$('#myP').text(),
            'nodejson':JSON.stringify(recording_obj),
            'nodetype':"rpa",
        },
        success:function (data) {
			localStorage.setItem('savestatus',true);
            parent.add_nodename(edit_id,$('#myP').text())//添加节点名称到节点标签
        },
        error:function (data) {
            console.log("失败",data);
        }	   
    })
	
	$.ajax({
	   url:"/rpa_updata_000/",
	   type:"POST",                    
	   data:{
		   'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		   "file_name":$('input[name="file_name"]').val(),
		   "rpa_txt":editor.getValue()
	   },
	   success:function (data) {
			console.log('成功',data,'成功人事达文西')
	   },
	   error:function (data) {
		   console.log("失败",data);
	   }
	});	
    $(".popping-box-wrap", parent.document).hide(500);
});


